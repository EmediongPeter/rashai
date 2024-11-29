import { User, UserSchema } from "@/auth/schema/auth.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProfileEventListener } from "./event/register.event";
import ProfileSchema, { Profile } from "./schema/profile.schema";
import { UserProfileController } from "./user.profile.controller";
import { UserProfileService } from "./user.profile.service";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [UserProfileController],
  providers: [ProfileEventListener, UserProfileService],
})
export class UserProfileModule {}
