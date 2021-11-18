import { AxiosResponse } from 'axios';
import { Document } from 'mongoose';
import { params } from './enums';

export interface Channel extends Document {
  userId: string;
  login: string;
  displayName: string;
  isLogged: boolean;
}

export interface Log extends Document {
  date: Date;
  [params.userId]: number;
  [params.login]: string;
  [params.displayName]: string;
  [params.color]: string;
  [params.badges]: Record<string, string>;
  [params.badgeInfo]: Record<string, string>;
  [params.emotes]: Record<string, string[]>;
  [params.subInfo]: SubInfo;
  [params.bits]: number;
  [params.duration]: number;
  [params.membership]: Array<string>;
  [params.message]: string;
  [params.messageType]: string;
}

export interface SubInfo {
  [params.tier]: number;
  [params.months]: number;
  [params.message]?: string;
  [params.streak]?: number;
  [params.count]?: number;
  [params.userId]?: number;
  [params.login]?: string;
  [params.displayName]?: string;
}

export interface Channel extends Document {
  userId: string;
  login: string;
  displayName: string;
  isLogged: boolean;
}

interface HelixUser {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email: string;
  created_at: Date;
}

export interface User {
  userId: string;
  login: string;
  displayName: string;
}

export interface UserResponse extends AxiosResponse {
  data: HelixUser[];
}
