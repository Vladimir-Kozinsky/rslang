interface IObj<T> {
  [key: string]: T;
}

interface IElements {
  htmlElements: IObj<HTMLElement>;
  svgElements: IObj<SVGElement>;
}

interface IUserData {
  name: string;
  email: string;
  password: string;
  gender: string;
}

interface IAuthData {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

type tokenData = Pick<IAuthData, 'token' | 'refreshToken'>;
type userAuthData = Pick<IUserData, 'email' | 'password'>;

export { IObj, IElements, IUserData, IAuthData, tokenData, userAuthData };
