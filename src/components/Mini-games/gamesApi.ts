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

  // getUserWords(userId: number) {
  //     return (async () => {
  //         const response = await fetch(`${GamesApi.BASE_URL}/users/${userId}/words`);
  //         return response.json();
  //     })
  // }

  // getUserWordById(userId: number, wordId:number) {
  //     return (async () => {
  //         const response = await fetch(`${GamesApi.BASE_URL}/users/${userId}/words/${wordId}`)
  //         return response.json()
  //     })
  // }

  // updateUserWord(userId: number, wordId:number) {
  //     return (async () => {
  //         (await fetch(`GamesApi.BASE_URL/users/${userId}/words/${wordId}`, {
  //             method: 'PUT',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({userId, wordId}),
  //           })).json();
  //     })
  // }
}

export default GamesApi;
