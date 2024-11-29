import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UserProfileService } from './user.profile.service';
import { UpdateProfileDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetAuthUser } from '../auth/decorators/user.decorators';
import { IAuthUser } from '../auth/interfaces/auth.interface';

@Controller('')
export class UserProfileController {
  constructor(private readonly profileService: UserProfileService) {}

  @Get('/all')
  getAllUsers() {
    return this.profileService.getAllUsers();
  }

  @Get()
  getProfile(@GetAuthUser() user: IAuthUser) {
    return this.profileService.getUserProfile(user.id);
  }

  @Put()
  @UseInterceptors(FileInterceptor('avatar'))
  update(
    @GetAuthUser() user: IAuthUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateUserProfile(
      user.id,
      updateProfileDto,
    );
  }

  @Delete()
  delete(@GetAuthUser() user: IAuthUser) {
    return this.profileService.deleteUserProfile(user);
  }
}
