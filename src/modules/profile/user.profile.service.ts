import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './schema/profile.schema';
import { userSelectFields } from './serializers/fields.serializer';
import { Model, Types } from 'mongoose';
import { UpdateProfileDto } from './dto';
import { ServiceException } from 'src/common/helpers/exceptions/exception/service.layer.exception';
import { parseDBError } from 'src/common/main';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(Profile.name)
    private ProfileSchema: Model<ProfileDocument>,
  ) {}

  async getAllUsers() {
    try {
      return await this.ProfileSchema.find()
    } catch (error) {
      throw new ServiceException({ error: parseDBError(error) });
    }
  }
  async getUserProfile(id: Types.ObjectId): Promise<ProfileDocument> {
    try {
      const user = await this.ProfileSchema.findById(id).select([
        'phone',
        'fullname',
        'email',
        'gender',
        'dob',
        'location',
        'avatar',
        'type',
      ]);
      if (!user) {
        throw new ServiceException({ error: 'user not found' });
      }
      return user;
    } catch (error) {
      throw new ServiceException({ error: parseDBError(error) });
    }
  }

  async updateUserProfile(
    id: Types.ObjectId,
    data: UpdateProfileDto,
  ): Promise<ProfileDocument> {
    const avatarExists = await this.ProfileSchema.findOne({ _id: id });

    data.user = id;

    return this.ProfileSchema.findOneAndUpdate({ _id: id }, data, {
      new: true,
      upsert: true,
    })
      .then(async (user) => {
        return user;
      })
      .catch((e) => {
        throw new ServiceException({ error: parseDBError(e) });
      });
  }

  async deleteUserProfile(user): Promise<ProfileDocument> {
    try {
      const profile = await this.ProfileSchema.findById(user.id);
      if (!profile) {
        throw new ServiceException({ error: 'profile not found', status: 404 });
      }

      if (user.id == profile.user) {
        await profile.deleteOne();
        return profile;
      }

      throw new ServiceException({ error: 'permission denied', status: 403 });
    } catch (error) {
      throw new ServiceException({ error: parseDBError(error) });
    }
  }
}
