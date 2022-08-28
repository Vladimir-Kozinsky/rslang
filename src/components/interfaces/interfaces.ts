interface Word {
  id: string;
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
}

export interface AudioCallData {
  word: string;
  wordTranslate: string;
  wordTranslates: (string | string[])[];
  wordImage: string;
  isTrue?: boolean;
  wordAudio: string;
}

export default Word;
