import UserAccountApi from '../Api/UserAccountApi';
import { IAuthData, tokenData, userPersonalData } from '../types';
import AuthView from './AuthView';
import ApiData from '../Api/ApiData';

export default class AuthController {
  view: AuthView;
  api: UserAccountApi;

  constructor() {
    this.view = new AuthView();
    this.api = new UserAccountApi();
  }

  async checkToken(): Promise<void> {
    if (ApiData.userIsAuth) {
      try {
        const getUserResponse = await this.api.getUser();
        if (!getUserResponse.ok) {
          if (getUserResponse.status === 401) {
            const getNewUserTokensResponse = await this.api.getNewTokens();
            if (getNewUserTokensResponse.ok) {
              const data: tokenData = await getNewUserTokensResponse.json();
              ApiData.token = data.token;
              ApiData.refreshToken = data.refreshToken;
              ApiData.tokenExpirationDate = Date.now() + 1000 * 60 * 60 * 4.5;
              setTimeout(() => {
                this.checkToken();
              }, ApiData.tokenExpirationDate - Date.now() - 1000 * 60 * 10);
            } else {
              ApiData.userIsAuth = false;
            }
          } else if (getUserResponse.status === 403) {
            throw new Error('User not found');
          }
        } else {
          setTimeout(() => {
            this.checkToken();
          }, ApiData.tokenExpirationDate - Date.now() - 1000 * 60 * 10);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async getStartScreen(
    drawGuestUserViewFunc: () => HTMLButtonElement | Promise<HTMLButtonElement>,
    drawAuthUserViewFunc: (userPersonalData: userPersonalData) => HTMLButtonElement | Promise<HTMLButtonElement>
  ): Promise<void> {
    this.view.drawAuthContainer();
    if (ApiData.userIsAuth) {
      const userPersonalData = {
        name: ApiData.userName,
        gender: ApiData.userGender,
      };
      const logOutButton: HTMLButtonElement = await drawAuthUserViewFunc(userPersonalData);
      this.setLogOutListener(logOutButton, drawGuestUserViewFunc, drawAuthUserViewFunc);
    } else {
      const signInButton: HTMLButtonElement = await drawGuestUserViewFunc();
      this.setSignInListener(signInButton, drawGuestUserViewFunc, drawAuthUserViewFunc);
    }
  }

  setSignInListener(
    signInButton: HTMLButtonElement,
    drawGuestUserViewFunc: () => HTMLButtonElement | Promise<HTMLButtonElement>,
    drawAuthUserViewFunc: (userPersonalData: userPersonalData) => HTMLButtonElement | Promise<HTMLButtonElement>
  ): void {
    signInButton.onclick = (event) => {
      this.getSignInScreen(drawGuestUserViewFunc, drawAuthUserViewFunc);
      const { blackout } = this.view.elements.htmlElements;
      blackout.classList.add('fill');
      blackout.classList.remove('fade');
    };
  }

  setLogOutListener(
    logOutButton: HTMLButtonElement,
    drawGuestUserViewFunc: () => HTMLButtonElement | Promise<HTMLButtonElement>,
    drawAuthUserViewFunc: (userPersonalData: userPersonalData) => HTMLButtonElement | Promise<HTMLButtonElement>
  ): void {
    logOutButton.onclick = async (event) => {
      ApiData.clear();
      const signInButton: HTMLButtonElement = await drawGuestUserViewFunc();
      this.setSignInListener(signInButton, drawGuestUserViewFunc, drawAuthUserViewFunc);
    };
  }

  getSignInScreen(
    drawGuestUserViewFunc: () => HTMLButtonElement | Promise<HTMLButtonElement>,
    drawAuthUserViewFunc: (userPersonalData: userPersonalData) => HTMLButtonElement | Promise<HTMLButtonElement>
  ): void {
    this.view.drawSignIn();
    this.setSignInFormListener(drawGuestUserViewFunc, drawAuthUserViewFunc);
    const { blackout, cancelButton, link } = this.view.elements.htmlElements;
    blackout.style.top = `${window.scrollY}px`;
    cancelButton.onclick = () => {
      blackout.classList.add('fade');
      blackout.classList.remove('fill');
      this.view.clearAuthContainer();
    };
    link.onclick = (event) => {
      event.preventDefault();
      this.getSignUpScreen(drawGuestUserViewFunc, drawAuthUserViewFunc);
    };
  }

  getSignUpScreen(
    drawGuestUserViewFunc: () => HTMLButtonElement | Promise<HTMLButtonElement>,
    drawAuthUserViewFunc: (userPersonalData: userPersonalData) => HTMLButtonElement | Promise<HTMLButtonElement>
  ): void {
    this.view.drawSignUp();
    this.setSignUpFormListener(drawGuestUserViewFunc, drawAuthUserViewFunc);
    const { blackout, cancelButton, link } = this.view.elements.htmlElements;
    cancelButton.onclick = () => {
      blackout.classList.add('fade');
      blackout.classList.remove('fill');
      this.view.clearAuthContainer();
    };
    link.onclick = (event) => {
      event.preventDefault();
      this.getSignInScreen(drawGuestUserViewFunc, drawAuthUserViewFunc);
    };
  }

  setSignUpFormListener(
    drawGuestUserViewFunc: () => HTMLButtonElement | Promise<HTMLButtonElement>,
    drawAuthUserViewFunc: (userPersonalData: userPersonalData) => HTMLButtonElement | Promise<HTMLButtonElement>
  ): void {
    const form = this.view.elements.htmlElements.authForm as HTMLFormElement;
    const maleInput = this.view.elements.htmlElements.maleInput as HTMLInputElement;
    const femaleInput = this.view.elements.htmlElements.femaleInput as HTMLInputElement;
    const nameField = this.view.elements.htmlElements.nameField as HTMLInputElement;
    const emailField = this.view.elements.htmlElements.emailField as HTMLInputElement;
    const passwordField = this.view.elements.htmlElements.passwordField as HTMLInputElement;

    form.onsubmit = async (event) => {
      event.preventDefault();
      const name = nameField.value;
      const email = emailField.value;
      const password = passwordField.value;
      const gender = maleInput.checked ? maleInput.value : femaleInput.value;
      const userData = {
        name,
        email,
        password,
        gender,
      };
      if (this.view.elements.htmlElements.errorMessage) {
        const { errorMessage } = this.view.elements.htmlElements;
        errorMessage.remove();
      }
      try {
        const response = await this.api.createUser(userData);
        if (!response.ok) {
          if (response.status === 417) {
            this.view.drawErrorMessage('Пользователь с таким адресом электронной почты уже зарегистрирован');
          } else if (response.status === 422) {
            this.view.drawErrorMessage('Некорректный адрес электронной почты или пароль');
          }
          emailField.value = '';
          passwordField.value = '';
        } else {
          this.getSignInScreen(drawGuestUserViewFunc, drawAuthUserViewFunc);
          this.view.drawSuccesMessage('Вы успешно зарегистрировались. Авторизуйтесь');
        }
      } catch (error) {
        console.log(error);
      }
    };
  }

  setSignInFormListener(
    drawGuestUserViewFunc: () => HTMLButtonElement | Promise<HTMLButtonElement>,
    drawAuthUserViewFunc: (userPersonalData: userPersonalData) => HTMLButtonElement | Promise<HTMLButtonElement>
  ): void {
    const { blackout } = this.view.elements.htmlElements;
    const form = this.view.elements.htmlElements.authForm as HTMLFormElement;
    const emailField = this.view.elements.htmlElements.emailField as HTMLInputElement;
    const passwordField = this.view.elements.htmlElements.passwordField as HTMLInputElement;

    form.onsubmit = async (event) => {
      event.preventDefault();
      const email = emailField.value;
      const password = passwordField.value;
      const userData = {
        email,
        password,
      };
      if (this.view.elements.htmlElements.errorMessage) {
        const { errorMessage } = this.view.elements.htmlElements;
        errorMessage.remove();
      } else if (this.view.elements.htmlElements.succesMessage) {
        const { succesMessage } = this.view.elements.htmlElements;
        succesMessage.remove();
      }
      try {
        const response = await this.api.signIn(userData);
        if (!response.ok) {
          if (response.status === 403 || response.status === 404) {
            this.view.drawErrorMessage('Некорректный адрес электронной почты или пароль');
          }
          emailField.value = '';
          passwordField.value = '';
        } else {
          const data: IAuthData = await response.json();
          ApiData.token = data.token;
          ApiData.refreshToken = data.refreshToken;
          ApiData.userIsAuth = true;
          ApiData.userId = data.userId;
          ApiData.userName = data.name;
          ApiData.userGender = data.userGender;
          ApiData.tokenExpirationDate = Date.now() + 1000 * 60 * 60 * 4.5;
          ApiData.userEmail = userData.email;
          blackout.classList.remove('fill');
          blackout.classList.add('fade');
          this.view.clearAuthContainer();
          const userPersonalData = {
            name: ApiData.userName,
            gender: ApiData.userGender,
          };
          const logOutButton: HTMLButtonElement = await drawAuthUserViewFunc(userPersonalData);
          this.setLogOutListener(logOutButton, drawGuestUserViewFunc, drawAuthUserViewFunc);
        }
      } catch (error) {
        console.log(error);
      }
    };
  }
}
