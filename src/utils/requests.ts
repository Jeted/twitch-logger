import axios from 'axios';
import { URL } from 'url';
import config from '../config';
import logger from '../misc/logger';
import { User, UserResponse } from '../misc/interfaces';

export async function getUserByLogin(login: string): Promise<User | undefined> {
  const url = new URL(`${config.API_BASE_URL}/helix/users`);
  url.searchParams.append('login', login);

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
