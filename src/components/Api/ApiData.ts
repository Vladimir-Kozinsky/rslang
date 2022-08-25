export default class ApiData {
  static basePath: string = 'http://localhost:3000';
  static token: string = '';
  static refreshToken: string = '';
  static tokenExpirationDate: number = Date.now();
  static userIsAuth: boolean = false;
  static userId: string = '';
  static userName: string = '';
  static userGender: string = '';

  static getDataFromLocalStorage() {
    if (localStorage.length !== 0) {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
      const userIsAuth = localStorage.getItem('userIsAuth');
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      const userGender = localStorage.getItem('userGender');

      if (token) ApiData.token = token;
      if (refreshToken) ApiData.refreshToken = refreshToken;
      if (tokenExpirationDate) ApiData.tokenExpirationDate = +tokenExpirationDate;
      if (userIsAuth) ApiData.userIsAuth = JSON.parse(userIsAuth);
      if (userId) ApiData.userId = userId;
      if (userName) ApiData.userName = userName;
      if (userGender) ApiData.userGender = userGender;
    }
  }

  static clear() {
    localStorage.clear();
    this.token = '';
    this.refreshToken = '';
    this.tokenExpirationDate = Date.now();
    this.userIsAuth = false;
    this.userId = '';
    this.userName = '';
    this.userGender = '';
  }
}
