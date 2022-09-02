import Word, { Aggregate, AudioCallData } from './../interfaces/interfaces';
class GamesApi {
  static BASE_URL = 'https://react-learnwords-shahzod.herokuapp.com';

  getWords(group: string = '0', page: string = '0') {
    return (async () => {
      const response = await fetch(
        `${GamesApi.BASE_URL}/words?group=${group}&page=${page}`
      );
      return response.json();
    })();
  }

  getWordsById(id: string) {
    return (async () => {
      const response = await fetch(`${GamesApi.BASE_URL}/words/${id}`);
      return response.json();
    })();
  }

  getUserAggregatedWords(userId: string, token: string, group:string = '1', page: string = '0', wordsPerPage: string = '20') {
      return (async (): Promise<Response & Aggregate[]> => {
          const response  = await fetch(`${GamesApi.BASE_URL}/users/${userId}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=${wordsPerPage}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });
          return response.json();
      })();
  }

  async createUpdateUserWord(userId: string, token: string, wordId:string, wordData: Word | AudioCallData, difficulty: string) {
    let rawResponse
    rawResponse = await fetch(`https://react-learnwords-shahzod.herokuapp.com/users/${userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
                              difficulty,
                              optional: {
                                  wordData
                              }
      })
    });

    // if word exist in server then update word 
    if(rawResponse.status === 417) {
      console.log('update');
      rawResponse = await fetch(`https://react-learnwords-shahzod.herokuapp.com/users/${userId}/words/${wordId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                                difficulty,
                                optional: {
                                    wordData
                                }
        })
      }); 
    }
    const content = await rawResponse.json();

  };
}

export default GamesApi;
