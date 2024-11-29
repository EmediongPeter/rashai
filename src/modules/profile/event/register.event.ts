import { OnEvent } from '@nestjs/event-emitter';
import { UserProfileService } from '../user.profile.service';
import { Injectable } from '@nestjs/common';
import { SignUpProfileDTO } from '../dto';
import { NewUserEvent } from '@/auth/entities/event.entity';

@Injectable()
export class ProfileEventListener {
  constructor(private profileService: UserProfileService) {}
  @OnEvent('user.new')
  handleCreatedEvent({ user }: NewUserEvent) {
    const data: SignUpProfileDTO = {
      fullname: user.fullname,
      email: user.email,
    };

    return this.profileService.updateUserProfile(user.id, data).catch((e) => {
      console.log('Profile Event failed', { e });
    });
  }
}
