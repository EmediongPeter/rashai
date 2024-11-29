import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import * as argon from 'argon2';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User, UserDocument } from '../schema/auth.schema';
import { ServiceException } from 'src/common/helpers/exceptions/exception/service.layer.exception';
import { GoogleSigninDto, SignInDto, SignUpDto } from '../dto';
import { IAuthUser } from '../interfaces/auth.interface';
import { NewUserEvent } from '../entities/event.entity';
import { parseDBError } from 'src/common/main';
import { bruteForceCheck } from '../helper/auth.helper';

@Injectable()
export class AuthService {
  private client: OAuth2Client;
  constructor(
    @InjectModel(User.name) private UserSchema: Model<UserDocument>,
    private jwt: JwtService,
    private eventEmitter: EventEmitter2,
    private config: ConfigService,
  ) {
    this.client = new OAuth2Client(this.config.get('GOOGLE_CLIENT_ID'));
  }

  async signup(dto: SignUpDto): Promise<IAuthUser> {
    return this.UserSchema.find({ email: dto.email })
      .then(async (users) => {
        if (users.length) {
          throw new ServiceException({ error: 'email already exist' });
        }
        const user = new this.UserSchema({ ...dto });
        const password = await argon.hash(user.password);
        user.password = password;

        const eventObject = new NewUserEvent();
        eventObject.user = user;

        await user.save();

        this.eventEmitter.emit('user.new', eventObject);

        return this.signToken(user);
      })
      .catch((e) => {
        throw new ServiceException({ error: parseDBError(e) });
      });
  }

  async signin(dto: SignInDto) {
    return this.UserSchema.findOne({ email: dto.email })
      .then(async (user) => {
        if (!user) {
          throw new ServiceException({ error: 'Invalid login credentials' });
        }

        if (!(await bruteForceCheck(user))) {
          throw new ServiceException({ error: 'Too many attempts. Please try again after 5 minutes' });
        }
 
        if (await argon.verify(user.password, dto.password)) {
          user.attempt = 0;
          await user.save();

          return this.signToken(user);
        }

        throw new ServiceException({ error: 'Invalid login credentials' });
      })
      .catch((e) => {
        throw new ServiceException({ error: parseDBError(e) });
      });
  }

  async googleSignin(dto: GoogleSigninDto) {
    const data = await this.verifyGoogleToken(dto.token);
    return this.UserSchema.find({ email: data.email })
      .then(async (users) => {
        if (users.length) {
          return this.signToken(users[0]);
        }

        const user = new this.UserSchema({
          fullname: data.name,
          email: data.email,
          googleId: dto.googleId,
        });

        const eventObject = new NewUserEvent();
        eventObject.user = user;

        await user.save();

        this.eventEmitter.emit('user.new', eventObject);

        return this.signToken(user);
      })
      .catch((e) => {
        throw new ServiceException({ error: parseDBError(e) });
      });
  }

  private async signToken(user: UserDocument): Promise<IAuthUser> {
    const payload = {
      id: user._id,
      email: user.email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token: string = await this.jwt.signAsync(payload, {
      expiresIn: '8hr',
      secret: secret,
    });

    const refreshToken: string = await this.jwt.signAsync(payload, {
      expiresIn: '48hr',
      secret: secret,
    });

    const authUser: IAuthUser = {
      token,
      email: user.email,
      id: user._id,
      fullname: user.fullname,
    };
    user.refreshToken = refreshToken;
    user.isActive = true;

    await user.save();

    return authUser;
  }

  private async verifyGoogleToken(token: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: this.config.get('GOOGLE_CLIENT_ID'),
    });
    return ticket.getPayload();
  }
}
