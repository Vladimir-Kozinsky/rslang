import { IUserData, userAuthData, IStatisticsOptions, ISettingsOptions } from '../types';
import ApiData from './ApiData';

export default class UserAccountApi {
  async createUser(userData: IUserData): Promise<Response> {
    return await fetch(`${ApiData.basePath}/users`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  }

  async getUser(): Promise<Response> {
    return await fetch(`${ApiData.basePath}/users/${ApiData.userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ApiData.token}`,
        'Accept': 'application/json',
      },
    });
  }

  async updateUser(userAuthData: userAuthData): Promise<Response> {
    return await fetch(`${ApiData.basePath}/users/${ApiData.userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${ApiData.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userAuthData),
    });
  }

  async deleteUser(): Promise<Response> {
    return await fetch(`${ApiData.basePath}/users/${ApiData.userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${ApiData.token}`,
      },
    });
  }

  async getNewTokens(): Promise<Response> {
    return await fetch(`${ApiData.basePath}/users/${ApiData.userId}/tokens`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ApiData.refreshToken}`,
        'Accept': 'application/json',
      },
    });
  }

  async signIn(userAuthData: userAuthData): Promise<Response> {
    return await fetch(`${ApiData.basePath}/signin`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userAuthData),
    });
  }

  async getStatistics(): Promise<Response> {
    return await fetch(`${ApiData.basePath}/users/${ApiData.userId}/statistics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ApiData.token}`,
        'Accept': 'application/json',
      },
    });
  }

  async updateStatistics(statisticsOptions: IStatisticsOptions): Promise<Response> {
    return await fetch(`${ApiData.basePath}/users/${ApiData.userId}/statistics`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${ApiData.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statisticsOptions),
    });
  }

  async getSettings(): Promise<Response> {
    return await fetch(`${ApiData.basePath}/users/${ApiData.userId}/settings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ApiData.token}`,
        'Accept': 'application/json',
      },
    });
  }

  async updateSettings(settingsOptions: ISettingsOptions): Promise<Response> {
    return await fetch(`${ApiData.basePath}/users/${ApiData.userId}/settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${ApiData.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settingsOptions),
    });
  }
}
