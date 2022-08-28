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

  async appendDataToPage(difficulty: string) {
    const getData: AudioCallData[] = await this.createWordsForGame(difficulty);
    const audioContainer = document.querySelector('.audioCall-audio__container') as HTMLDivElement;
    let cartNum: number = 0;
    audioContainer!.innerHTML =`    
    <audio autoplay>
      <source src="${getData[0].wordAudio}" type="">
    </audio>`;
    let randomIndexes: number[] = [];
    function createRandomIndexesorWords() {
      while(randomIndexes.length < 5){
        const randomIndex = Math.floor(Math.random() * 5);
        if(randomIndexes.indexOf(randomIndex) === -1) randomIndexes.push(randomIndex);
      }
      return randomIndexes
    }
    createRandomIndexesorWords();
    function appendWrongTranslates() {
      const options: Element[] = Array.from(document.querySelectorAll('.options__button'));
      options.forEach((item: Element, index: number) => {
        if(index === 5) item.innerHTML = 'Не Знаю';
        else if(index !== 5) item.innerHTML = getData[0].wordTranslates.flat()[index];
      });
    }
    appendWrongTranslates();
    const optionsContainer = document.querySelector('.audioCall-options__container');

    // play audio onclick
    audioContainer!.addEventListener('click', () => {
      const audio = audioContainer!.children[0] as HTMLAudioElement;
      audio.play();
    })

    // create new Cart after click to options
    optionsContainer?.addEventListener('click', (e: Event) => {
      randomIndexes = [];
      createRandomIndexesorWords();
      const options: HTMLButtonElement[] = Array.from(document.querySelectorAll('.options__button'));
      const target = e.target as HTMLButtonElement;
      
      // create page with results if the cart is last
      if(cartNum > 19) {
        this.createResultsPage(getData);
      }
      // disable buttons after click
      options.forEach((item: HTMLButtonElement) => {
        if(item !== options[5] && target.classList.contains('options__button')) item.disabled = true;
      });
      if(target.classList.contains('options__button') && getData[cartNum].wordTranslate === target.innerHTML) {
        console.log(true);
        this.appendResult(getData, cartNum, 'true', target);        
        cartNum += 1;
      }
      else if (target.classList.contains('options__button') && target.innerHTML !== 'Не знаю' && target.innerHTML !== 'Дальше') {
        console.log(false);
        console.log(target.innerHTML);
        this.appendResult(getData, cartNum, 'false', target);        
        cartNum += 1;
      }
      else if(target.classList.contains('options__button') && target.innerHTML === 'Не знаю') {
        this.appendResult(getData, cartNum, 'doNotKnow', target);        
        cartNum += 1;
      }
      else if(target.innerHTML === 'Дальше') {
        console.log(target.innerHTML);
        console.log('object');
        audioContainer!.innerHTML =`    
        <audio autoplay>
          <source src="${getData[cartNum].wordAudio}" type="">
        </audio>`;
        options.forEach((item: HTMLButtonElement, index: number) => {
          if(item.innerHTML !== 'Не Знаю') { 
            item.disabled = false;
            item.innerHTML = getData[cartNum].wordTranslates.flat()[randomIndexes[index]];
            item.style.background = '#38304f';
            item.removeAttribute('style');
          };
        }); 
        target.innerHTML = 'Не знаю';
      }
    })

  }

}

export default AudioCall;