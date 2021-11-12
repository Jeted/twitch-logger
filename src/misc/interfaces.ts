import { Document } from 'mongoose';

export interface Channel extends Document {
  userId: string;
  login: string;
  displayName: string;
  isLogged: boolean;
}
