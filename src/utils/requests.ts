import axios from 'axios';
import config from '../config';
import logger from '../misc/logger';
import type { User, UserResponse } from '../misc/interfaces';

export async function getUserByLogin(login: string): Promise<User | undefined> {
  const url = `${config.API_BASE_URL}/helix/users?login=${login}`;

  try {
    const { data } = await axios.get<UserResponse>(url);
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
