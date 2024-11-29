import { Types } from 'mongoose';

export interface IAuthUser {
  token?: string;
  email?: string;
  phone?: string;
  fullname?: string;
  role?: string;
  id?: Types.ObjectId;
}
