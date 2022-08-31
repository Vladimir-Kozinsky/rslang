interface Word {
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

export default Word;
