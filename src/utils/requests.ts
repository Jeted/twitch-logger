import axios from 'axios';
import config from '../config';
import { logger } from './logger';
import { User, UserResponse } from '../misc/interfaces';

export async function getUserByLogin(login: string): Promise<User | undefined> {
  const url = `${config.API_BASE_URL}/helix/users?login=${login}`;

  try {
    const { data } = await axios.get<UserResponse>(url.toString());
    const user = data.data[0];

    if (!user) return undefined;

    return {
      userId: user.id,
      login: user.login,
      displayName: user.display_name,
    };
  } catch (e) {
    logger.error(e);
  }
}

export async function getUsersById(array: string[]): Promise<User[]> {
  const url = `${config.API_BASE_URL}/helix/users?id=${array.join('&id=')}`;

  try {
    const { data } = await axios.get<UserResponse>(url);
    const users = data.data;

    if (!users.length) return [];

    return users.map((user) => ({
      userId: user.id,
      login: user.login,
      displayName: user.display_name,
    }));
  } catch (e) {
    logger.error(e);
    return [];
  }
}
