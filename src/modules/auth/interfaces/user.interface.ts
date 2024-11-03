import { Types } from 'mongoose';

export interface IUser {
  email?: string;
  phone?: string;
  fullname?: string;
  avatar?: string;
  type?: number;
  id?: Types.ObjectId;
}
