import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class SignUpProfileDTO {
  user?: Types.ObjectId;

  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('NG')
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  avatar_id?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
