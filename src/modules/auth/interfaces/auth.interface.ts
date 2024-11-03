import { Types } from 'mongoose';

export interface IAuthUser {
  token?: string;
  email?: string;
  phone?: string;
  fullname?: string;
  isPhoneNumberConfirmed?: boolean;
  type?: number;
  role?: string;
  id?: Types.ObjectId;
  business?: {
    _id?: Types.ObjectId;
    name?: string;
    line?: string;
  };
}
