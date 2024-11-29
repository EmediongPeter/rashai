import { User } from '@/auth/schema/auth.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEmail, isMobilePhone } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Profile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({
    type: String,
    validate: [
      { validator: isEmail, message: () => 'please enter a valid email' },
    ],
  })
  email: string;

  @Prop({
    type: String,
    validate: [
      {
        validator: isMobilePhone,
        message: () => 'please enter a valid phone number',
      },
    ],
  })
  phone: string;

  @Prop({ type: String })
  fullname: string;

  @Prop({ type: String, default: 'ACTIVE' })
  status: string;

  @Prop({ type: String })
  gender: string;

  @Prop({ type: String })
  dob: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String })
  avatar_id: string;

  @Prop({ type: String })
  location: string;
}

export type ProfileDocument = HydratedDocument<Profile>;
const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.pre<ProfileDocument>(
  'deleteOne',
  { document: true },
  async function (next) {
    const profile = this as ProfileDocument;

    await this.$model('User').deleteOne({ _id: profile.user });

    return next();
  },
);

export default ProfileSchema;
