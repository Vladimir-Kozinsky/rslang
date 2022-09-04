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

export interface Word {
  isTrue?: boolean;
  _id: string;
  group: 0;
  page: 0;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
  guessedRight?: number;
  difficulty?: string;
  userWord?: {difficulty: string, optional: {wordData: AudioCallData}};
}

export interface AudioCallData {
  word: string;
  wordTranslate: string;
  wordTranslates: (string | string[])[];
  wordImage: string;
  isTrue?: boolean;
  wordAudio: string;
  guessedRight?: number;
  difficulty?: string;
  wordId?: string;
}

export interface Aggregate {
  paginatedResults: Word[];
  totalCount:[count:number];
}

export interface UserWord {
  id: string;
  _id: string;
  group: 0;
  page: 0;
  difficulty: string;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
  optional: {word: AudioCallData, wordImage: string, wordAudio: string, guessedRight: number, wordId: string, isTrue: boolean}
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
