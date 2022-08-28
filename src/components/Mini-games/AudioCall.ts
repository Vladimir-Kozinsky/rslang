import App from '../App';
import Container from '../Container/Container';
import { AudioCallData } from './../interfaces/interfaces';
import Word from "../interfaces/interfaces";
import GamesApi from "./gamesApi";
import MiniGames from './MiniGames';


class AudioCall {
    createPage() {
      const miniGames = new MiniGames();
        const content = document.querySelector(
            '.container__content'
          ) as HTMLDivElement;
      
          const audioCallContainer = document.createElement('div') as HTMLDivElement;
          audioCallContainer.classList.add('audioCall__container');

          const returnToPrevPage = document.createElement('div');
          returnToPrevPage.classList.add('return-to-prev-page');
      
          const title = document.createElement('h2') as HTMLHeadingElement;
          title.textContent = 'Аудиовызов';

          const progressDotsContainer = document.createElement('div') as HTMLDivElement;
          progressDotsContainer.classList.add('audioCall-progress-dots__container')
          audioCallContainer.append(progressDotsContainer);

          for (let i = 0; i < 20; i += 1) {
            const progressDot = document.createElement('span') as HTMLSpanElement;
            progressDot.dataset.wordNum = i.toString();
            progressDotsContainer.append(progressDot);
          }

          const audioContainer = document.createElement('div') as HTMLDivElement;
          audioContainer.classList.add('audioCall-audio__container');

        const optionsContainer = document.createElement('div') as HTMLDivElement;
        optionsContainer.classList.add('audioCall-options__container');

        for (let i = 0; i < 6; i += 1) {
            const option = document.createElement('button') as HTMLButtonElement;
            option.classList.add('options__button');
            if(i === 5) option.innerHTML = 'Не Знаю';
            option.dataset.optionNum = i.toString();
            optionsContainer.append(option);
        }

        returnToPrevPage.addEventListener('click', () => {
          miniGames.backToPage();
        });

        document.querySelector('aside')?.remove();
        audioCallContainer.append(returnToPrevPage)
        audioCallContainer.append(title);
        content.append(audioCallContainer);
        audioCallContainer.append(progressDotsContainer);
        audioCallContainer.append(audioContainer)
        audioCallContainer.append(optionsContainer)
    }

    async createWordsForGame(difficulty: string) {
      const api = new GamesApi();
      const randomPage = Math.floor(Math.random() * 30).toString();
      const wordsArr: Word[] = await api.getWords(difficulty, randomPage);
      
      function shuffleArr(array: Word[]) {
        let currentIndex = array.length;
        let randomIndex;
        while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
  
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
          ];
        }
  
        return array;
      }
      shuffleArr(wordsArr);
      const dataForCart = [];
     for (let i = 0; i < wordsArr.length; i += 1) {
      const {word} = wordsArr[i];
      const wordAudio = `https://react-learnwords-shahzod.herokuapp.com/${wordsArr[i].audio}`
      const {wordTranslate} = wordsArr[i];
      const wrongTranslates: string[] = [];
      let wrongTranslatesAmount: number = 4;
      const wordImage = wordsArr[i].image;
      dataForCart.push({
        word,
        wordTranslate,
        wordTranslates: [wrongTranslates, wordTranslate],
        wordImage,
        wordAudio
      });
      for (let j = 0; j < wrongTranslatesAmount; j += 1) {
        const randomIndex = Math.floor(Math.random() * 19);
        if(wrongTranslates.includes(wordsArr[randomIndex].wordTranslate) || randomIndex === i) wrongTranslatesAmount += 1;
        if(randomIndex !== i && !wrongTranslates.includes(wordsArr[randomIndex].wordTranslate)) wrongTranslates.push(wordsArr[randomIndex].wordTranslate);
      }
     }
     return dataForCart
  }

}

export default AudioCall;