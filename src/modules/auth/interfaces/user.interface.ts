import { Types } from 'mongoose';

export interface IUser {
  email?: string;
  phone?: string;
  fullname?: string;
  avatar?: string;
  id?: Types.ObjectId;
}
