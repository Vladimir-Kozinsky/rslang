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
  userGender: string;
}

type tokenData = Pick<IAuthData, 'token' | 'refreshToken'>;

type userAuthData = Pick<IUserData, 'email' | 'password'>;
type userPersonalData = Pick<IUserData, 'name' | 'gender'>;

interface IWordOptions {
  difficulty: string;
  optional: IObj<string>;
}

interface IStatisticsOptions {
  learnedWords: number;
  optional: IObj<string>;
}

interface ISettingsOptions {
  wordsPerDay: number;
  optional: IObj<string>;
}

export {
  IObj,
  IElements,
  IUserData,
  IAuthData,
  tokenData,
  userAuthData,
  userPersonalData,
  IWordOptions,
  IStatisticsOptions,
  ISettingsOptions,
};
