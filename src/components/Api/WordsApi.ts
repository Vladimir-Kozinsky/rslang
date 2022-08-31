import ApiData from './ApiData';
import { IWordOptions } from '../types';

export default class WordsApi {
  async getChunkWords(group: number, page: number): Promise<Response> {
    return await fetch(`${ApiData.basePath}/words?group=${group}&page=${page}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
  }

  async getWordById(wordId: string): Promise<Response> {
    return await fetch(`${ApiData.basePath}/words/${wordId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
  }
  
  async getUserWords(): Promise<Response> {
    return await fetch(`${ApiData.basePath}/users/${ApiData.userId}/words`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ApiData.token}`,
        'Accept': 'application/json',
      },
    });
  }

  async createUserWord(wordId: string, wordOptions: IWordOptions): Promise<Response> {
    return await fetch(`${ApiData.basePath}/users/${ApiData.userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ApiData.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wordOptions),
    });
  }

  async getUserWordById(wordId: string): Promise<Response> {
    return await fetch(`${ApiData.basePath}/users/${ApiData.userId}/words/${wordId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ApiData.token}`,
        'Accept': 'application/json',
      },
    });
  }

  async updateUserWord(wordId: string, wordOptions: IWordOptions): Promise<Response> {
    return await fetch(`${ApiData.basePath}/users/${ApiData.userId}/words/${wordId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${ApiData.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wordOptions),
    });
  }

  async deleteUserWord(wordId: string): Promise<Response> {
    return await fetch(`${ApiData.basePath}/users/${ApiData.userId}/words/${wordId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${ApiData.token}`,
      }
    });
  }

  async getUserAggregatedWords(
    group: number | null = null, 
    page: number | null = null, 
    wordsPerPage: number | null = null, 
    filter: string | null = null,
    ): Promise<Response> {
    let queryString: string = '';
    if (arguments.length > 0) {
      queryString = '?';
      if (group) queryString = `${queryString}group=${group}&`;
      if (page) queryString = `${queryString}page=${page}&`;
      if (wordsPerPage) queryString = `${queryString}wordsPerPage=${wordsPerPage}&`;
      if (filter) queryString = `${queryString}filter=${filter}&`;
      queryString = queryString.slice(0, -1);
    }
    return await fetch(`${ApiData.basePath}/users/${ApiData.userId}/aggregatedWords${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ApiData.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  async getUserAggregatedWordById(wordId: string): Promise<Response> {
    return await fetch(`${ApiData.basePath}/users/${ApiData.userId}/aggregatedWords/${wordId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ApiData.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }
}
