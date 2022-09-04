import App from '../App';
import Container from '../Container/Container';
import { AudioCallData } from './../interfaces/interfaces';
import Word from "../interfaces/interfaces";
import GamesApi from "./gamesApi";
import MiniGames from './MiniGames';
import UserAccountApi from '../Api/UserAccountApi';
import { IObj, IStatisticsOptions } from '../types';
import ApiData from '../Api/ApiData';


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

    async createWordsForGame(difficulty: string, page: number = -1) {
      const api = new GamesApi();
      let randomPage: string;
      const token: string = localStorage.getItem('token')!;

      // if game launched from menu choose random page
      if(page === -1) randomPage = Math.floor(Math.random() * 30).toString();
      else randomPage = page.toString();

      let wordsArr: Word[];

      // check is user guest or registered
      if(ApiData.userIsAuth){
         wordsArr = (await api.getUserAggregatedWords(ApiData.userId, token, difficulty, randomPage))[0].paginatedResults;
      }
      else wordsArr = await api.getWords(difficulty, randomPage);

      // create additional words if they are not enough
      if(wordsArr.length < 15 && +randomPage > 0) {
        const additionalWords: Word[] = await api.getWords(difficulty, (+randomPage - 1).toString());
        for (let i = 0; i < 20 - wordsArr.length; i += 1) {
          wordsArr.push(additionalWords[i])
        }
      }

    // create counter which counts how many times user guessed right choice
    for (let i = 0; i < wordsArr.length; i += 1) {
      if(wordsArr[i].userWord) {
        if(!wordsArr[i].userWord!.optional.wordData.guessedRight) {
          wordsArr[i].userWord!.optional.wordData.guessedRight = 0;
        }
      }
 
    }

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
      let guessedRight: number
      if(wordsArr[i].userWord) {
         guessedRight = wordsArr[i].userWord!.optional.wordData.guessedRight!;
      }
      else  guessedRight = 0;
      let wrongTranslatesAmount: number = 4;
      const wordImage = wordsArr[i].image;
      const wordId = wordsArr[i]._id;
      dataForCart.push({
        word,
        wordTranslate,
        wordTranslates: [wrongTranslates, wordTranslate],
        wordImage,
        wordAudio,
        guessedRight,
        wordId
      });
      for (let j = 0; j < wrongTranslatesAmount; j += 1) {
        const randomIndex = Math.floor(Math.random() * 19);
        if(wrongTranslates.includes(wordsArr[randomIndex].wordTranslate) || randomIndex === i) wrongTranslatesAmount += 1;
        if(randomIndex !== i && !wrongTranslates.includes(wordsArr[randomIndex].wordTranslate)) wrongTranslates.push(wordsArr[randomIndex].wordTranslate);
      }
     }
     return dataForCart
  }

  async appendDataToPage(difficulty: string, page: number = -1) {
    const getData: AudioCallData[] = await this.createWordsForGame(difficulty, page);
    const audioContainer = document.querySelector('.audioCall-audio__container') as HTMLDivElement;
    let cartNum: number = 0;
    audioContainer!.innerHTML =`    
    <audio autoplay>
      <source src="${getData[0].wordAudio}" type="">
    </audio>`;
    let randomIndexes: number[] = [];
    function createRandomIndexesorWords() {
      randomIndexes = [];
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

    // control from keyboard
    const controlFromKeyboard = (e: KeyboardEvent) => {
      const keyName = e.key;
      const optionsButton = Array.from(document.querySelectorAll('.options__button')) as HTMLButtonElement[];
      switch (keyName) {
        case '1':
          createRandomIndexesorWords();
          if(optionsButton[0].innerHTML === getData[cartNum].wordTranslate) {
            getData[cartNum].guessedRight! = getData[cartNum].guessedRight! + 1;
            this.appendResult(getData, cartNum, 'true', optionsButton[0]); 
            cartNum += 1;
          }
          else {
            this.appendResult(getData, cartNum, 'false', optionsButton[0]);        
            cartNum += 1;
          }
          document.removeEventListener('keydown', controlFromKeyboard);
          break;
        case '2':
          createRandomIndexesorWords();
          if(optionsButton[1].innerHTML === getData[cartNum].wordTranslate) {
            getData[cartNum].guessedRight! = getData[cartNum].guessedRight! + 1;
            this.appendResult(getData, cartNum, 'true', optionsButton[1]); 
            cartNum += 1;
          }
          else {
            this.appendResult(getData, cartNum, 'false', optionsButton[1]);        
            cartNum += 1;
          }
          document.removeEventListener('keydown', controlFromKeyboard);
          break;
        case '3':
          createRandomIndexesorWords();
          if(optionsButton[2].innerHTML === getData[cartNum].wordTranslate) {
            getData[cartNum].guessedRight! = getData[cartNum].guessedRight! + 1;
            this.appendResult(getData, cartNum, 'true', optionsButton[2]); 
            cartNum += 1;
          }
          else {
            this.appendResult(getData, cartNum, 'false', optionsButton[2]);        
            cartNum += 1;
          }
          document.removeEventListener('keydown', controlFromKeyboard);
          break;
        case '4':
          createRandomIndexesorWords();
          if(optionsButton[3].innerHTML === getData[cartNum].wordTranslate) {
            getData[cartNum].guessedRight! = getData[cartNum].guessedRight! + 1;
            this.appendResult(getData, cartNum, 'true', optionsButton[3]); 
            cartNum += 1;
          }
          else {
            this.appendResult(getData, cartNum, 'false', optionsButton[3]);        
            cartNum += 1;
          }
          document.removeEventListener('keydown', controlFromKeyboard);
          break;
        case '5':
          createRandomIndexesorWords();
          if(optionsButton[4].innerHTML === getData[cartNum].wordTranslate) {
            getData[cartNum].guessedRight! = getData[cartNum].guessedRight! + 1;
            this.appendResult(getData, cartNum, 'true', optionsButton[4]); 
            cartNum += 1;
          }
          else {
            this.appendResult(getData, cartNum, 'false', optionsButton[4]);        
            cartNum += 1;
          }
          document.removeEventListener('keydown', controlFromKeyboard);
          break;
        case 'Shift': 
        createRandomIndexesorWords();
        if(optionsButton[5].innerHTML === 'Не Знаю') {
          this.appendResult(getData, cartNum, 'doNotKnow', optionsButton[5]);        
          cartNum += 1;
        }
        document.removeEventListener('keydown', controlFromKeyboard);
          break;
        case ' ':
          // if user clicks space repeat audio
          const audio = document.querySelector('.audioCall-audio__container')!.children[0] as HTMLAudioElement;
          audio.play();
          break
        default:
          break;
      }
    }

    const callResultsPage = () => {
      // create page with results if the cart is last
      if(cartNum > 19) {
        // send user words to user/words
        const api = new GamesApi();
        const token: string = localStorage.getItem('token')!;

        // disable key events
        document.removeEventListener('keydown', controlFromKeyboard);
        document.removeEventListener('keydown', switchToNextWord);
        for (let i = 0; i < getData.length; i += 1) {
          api.createUpdateUserWord(ApiData.userId, token, getData[i].wordId!, getData[i], 'hard')
        }

        let streaksArr: number[][] = [];
        const progressDots = Array.from(document.querySelectorAll('[data-word-num]')) as HTMLSpanElement[];
        progressDots.forEach((item: HTMLSpanElement, index: number) => {
          if(index > 0) {
            if(item.style.background === 'rgb(14, 165, 1)' && progressDots[index - 1].style.background !== 'rgb(14, 165, 1)') streaksArr.push([1]);
            else if(item.style.background === 'rgb(14, 165, 1)' && progressDots[index - 1].style.background === 'rgb(14, 165, 1)') streaksArr[streaksArr.length - 1][0]++;
          }
          else {
            if(item.style.background === 'rgb(14, 165, 1)') streaksArr.push([1]);  
          }
        });
        if(streaksArr.length === 0) this.createResultsPage(getData, '0');
        else {
          const longestStreak: string = streaksArr.sort((a, b) => b[0] - a[0])[0][0].toString();
          this.createResultsPage(getData, longestStreak);
        }

      }
}

    function switchToNextWord(e: KeyboardEvent) {
      const key = e.key;
      const optionsButton = Array.from(document.querySelectorAll('.options__button')) as HTMLButtonElement[];
      callResultsPage();
      createRandomIndexesorWords();
      if(key === 'Enter') { 
        document.addEventListener('keydown', controlFromKeyboard); 
        if(optionsButton[5].innerHTML === 'Дальше') {
          audioContainer!.innerHTML =`    
          <audio autoplay>
            <source src="${getData[cartNum].wordAudio}" type="">
          </audio>`;
          optionsButton.forEach((item: HTMLButtonElement, index: number) => {
            if(item.innerHTML !== 'Не Знаю') { 
              item.disabled = false;
              item.innerHTML = getData[cartNum].wordTranslates.flat()[randomIndexes[index]];
              item.style.background = '#38304f';
              item.removeAttribute('style');
            };
          }); 
          optionsButton[5].innerHTML = 'Не Знаю';
        }
      }
    }

    document.addEventListener('keydown', controlFromKeyboard);
    document.addEventListener('keydown', switchToNextWord);

    // create new Cart after click to options
    optionsContainer?.addEventListener('click', (e: Event) => {
      randomIndexes = [];
      createRandomIndexesorWords();
      const options: HTMLButtonElement[] = Array.from(document.querySelectorAll('.options__button'));
      const target = e.target as HTMLButtonElement;
      
      callResultsPage()
      // disable buttons after click
      options.forEach((item: HTMLButtonElement) => {
        if(item !== options[5] && target.classList.contains('options__button')) item.disabled = true;
      });
      if(target.classList.contains('options__button') && getData[cartNum].wordTranslate === target.innerHTML) {
        getData[cartNum].guessedRight! = getData[cartNum].guessedRight! + 1;
        this.appendResult(getData, cartNum, 'true', target); 
        cartNum += 1;
      }
      else if (target.classList.contains('options__button') && target.innerHTML !== 'Не знаю' && target.innerHTML !== 'Дальше') {
        this.appendResult(getData, cartNum, 'false', target);        
        cartNum += 1;
      }
      else if(target.classList.contains('options__button') && target.innerHTML === 'Не знаю') {
        this.appendResult(getData, cartNum, 'doNotKnow', target);        
        cartNum += 1;
      }
      else if(target.innerHTML === 'Дальше') {
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

  async appendResult(data: AudioCallData[], cartNum: number, isTrue: string, option: HTMLButtonElement) {
    const audioContainer = document.querySelector('.audioCall-audio__container') as HTMLDivElement;
    const trueImage = document.createElement('img');
    const options: Element[] = Array.from(document.querySelectorAll('.options__button'));
    const progressDots: HTMLSpanElement[] = Array.from(document.querySelectorAll('span[data-word-num]'));

    trueImage.setAttribute('src', `https://react-learnwords-shahzod.herokuapp.com/${data[cartNum].wordImage}`)
    audioContainer.append(trueImage);
    if(isTrue === 'true') {
      option.style.background = '#0EA501';
      progressDots[cartNum].style.background = '#0EA501';
      data[cartNum].isTrue = true;
    }
    else if(isTrue === 'false') {
      const trueWord = options.find((item) => item.innerHTML === data[cartNum].wordTranslate) as HTMLButtonElement;
      trueWord.style.background = '#0EA501'
      option.style.background = '#981111'
      progressDots[cartNum].style.background = '#981111'
      data[cartNum].isTrue = false;
    }
    else {
        const trueWord = options.find((item) => item.innerHTML === data[cartNum].wordTranslate) as HTMLButtonElement;
        trueWord.style.background = '#0EA501'
        progressDots[cartNum].style.background = '#C9CC31';
      }

    options[5].innerHTML = 'Дальше';

    audioContainer.append(trueImage);
  }

  async createResultsPage(data: AudioCallData[], longestStreak: string) {
    const content = document.querySelector(
      '.container__content'
    ) as HTMLDivElement;
    const app = new App();
    const container = new Container();

    const containerBlock = document.querySelector('.container') as HTMLDivElement;
    containerBlock.prepend(container.createMenu());
    content.innerHTML = '';

    const resultsCartContainer = document.createElement('div');
    resultsCartContainer.classList.add('audioCall-results-cart__container');
    resultsCartContainer.classList.add('results-cart__container');

    const resultsContainer = document.createElement('div');
    resultsContainer.classList.add('audioCall-results__container');
    resultsContainer.classList.add('results__container');
     
    const resultsCart = document.createElement('div');
    resultsCart.classList.add('audioCall-results-cart');
    resultsCart.classList.add('results-cart');

    const title = document.createElement('h2') as HTMLHeadingElement;
    title.textContent = 'Ваш результат:';

    const answersBlock = document.createElement('div') as HTMLDivElement;
    answersBlock.classList.add('audioCall-results-answers-block');
    answersBlock.classList.add('results-answers-block');

    // audio plays when clicking to the icon
    answersBlock.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLDivElement;
      if(target.classList.contains('correct-answer__audio') || target.classList.contains('inCorrect-answer__audio')) {
        const audio = target.children[0] as HTMLAudioElement;
        audio.play();
      }
    })

    const correctAnswers = data.filter((item) => item.isTrue);

    const correctAnswersContainer = document.createElement('div') as HTMLDivElement;

    const correctAnswersTotal = document.createElement('span') as HTMLSpanElement;
    correctAnswersTotal.classList.add('audioCall-results-correct-answers-total');
    correctAnswersTotal.classList.add('results-correct-answers-total');
    correctAnswersTotal.textContent = `Правильные ответы:${correctAnswers.length.toString()}`;
    
    for (let i = 0; i < correctAnswers.length; i += 1) {
      const correctAnswerBlock = document.createElement('div') as HTMLDivElement;
      correctAnswerBlock.classList.add('correct-answer__block');
      const answerAudio = document.createElement('div') as HTMLDivElement;
      answerAudio.classList.add('correct-answer__audio');
      const correctAnswerWord = document.createElement('span') as HTMLSpanElement;
      correctAnswerWord.classList.add('correct-answer__word');

      answerAudio.innerHTML = `<audio>
        <source src="${correctAnswers[i].wordAudio}" type="">
      </audio>`;
      correctAnswerWord.textContent = `${correctAnswers[i].word} - ${correctAnswers[i].wordTranslate}`;
      correctAnswersContainer.append(correctAnswerBlock);
      correctAnswerBlock.append(answerAudio);
      correctAnswerBlock.append(correctAnswerWord);
    }

    const inCorrectAnswers = data.filter((item) => item.isTrue === false)
    const inCorrectAnswersContainer = document.createElement('div') as HTMLDivElement;

    const inCorrectAnswersTotal = document.createElement('span') as HTMLSpanElement;
    inCorrectAnswersTotal.classList.add('audioCall-results-incorrect-answers-total');
    inCorrectAnswersTotal.classList.add('results-incorrect-answers-total');
    inCorrectAnswersTotal.textContent = `Неправильные ответы:${inCorrectAnswers.length}`;

    for (let i = 0; i < inCorrectAnswers.length; i += 1) {
      const inCorrectAnswerBlock = document.createElement('div') as HTMLDivElement;
      inCorrectAnswerBlock.classList.add('inCorrect-answer__block');
      const answerAudio = document.createElement('div') as HTMLDivElement;
      answerAudio.classList.add('inCorrect-answer__audio');
      const inCorrectAnswerWord = document.createElement('span') as HTMLSpanElement;
      inCorrectAnswerWord.classList.add('inCorrect-answer__word');

      answerAudio.innerHTML = `<audio>
      <source src="${inCorrectAnswers[i].wordAudio}" type="">
    </audio>`;
      inCorrectAnswerWord.textContent = `${inCorrectAnswers[i].word} - ${inCorrectAnswers[i].wordTranslate}`;
      inCorrectAnswersContainer.append(inCorrectAnswerBlock);
      inCorrectAnswerBlock.append(answerAudio);
      inCorrectAnswerBlock.append(inCorrectAnswerWord);
    }

    // percentage of correct answers for statistics
    const correctAnswerPercentage: string = `${Math.round(100 / (data.length / correctAnswers.length)).toString()}%`;
    // amount of new Words
    const newWords: string = data.length.toString(); 
    content.append(resultsCartContainer);
    resultsCartContainer.append(resultsCart);
    resultsCart.append(title);
    resultsCart.append(answersBlock);
    answersBlock.append(correctAnswersContainer);
    answersBlock.append(inCorrectAnswersContainer);
    correctAnswersContainer.prepend(correctAnswersTotal);
    inCorrectAnswersContainer.prepend(inCorrectAnswersTotal);

    app.switchToAnotherPage();

     this.sendDataToStatistics(correctAnswerPercentage, newWords, longestStreak);
  }

  async sendDataToStatistics(audioCallCorrectAnswersPercentage: string, audioCallNewWords: string, audioCallLongestStreak: string) {
    const userAccountApi = new UserAccountApi()
    const RequestGetStatistics= await userAccountApi.getStatistics();

    let data: IObj<string>;
    let learnedWords: number;
    const getStatistics: IStatisticsOptions = await RequestGetStatistics.json() 
    if(RequestGetStatistics.ok) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      learnedWords = getStatistics.learnedWords + +document.querySelector('.audioCall-results-answers-block')?.children[0].children.length! - 1;
      data = getStatistics.optional;
    }
    else {
      // eslint-disable-next-line no-unsafe-optional-chaining
      learnedWords = +document.querySelector('.audioCall-results-answers-block')?.children[0].children.length! - 1;
      data = {
          audioCallCorrectAnswersPercentage,
          audioCallNewWords,
          audioCallLongestStreak 
        }
      
    }

    if(data.audioCallCorrectAnswersPercentage) {
      const prevCorrectAnswersPercentage: number = +data.audioCallCorrectAnswersPercentage.slice(0, -1);
      const prevNewWords: number = +data.audioCallNewWords;
      const prevLongestStreak: number = +data.audioCallLongestStreak;
      audioCallCorrectAnswersPercentage = `${Math.round(((+audioCallCorrectAnswersPercentage.slice(0, -1) + prevCorrectAnswersPercentage) / 2)).toString()  }%`;
      audioCallNewWords = (+audioCallNewWords + prevNewWords).toString();
      if(prevLongestStreak > +audioCallLongestStreak) {
         audioCallLongestStreak = prevLongestStreak.toString()
      };
    }
      data.audioCallCorrectAnswersPercentage = audioCallCorrectAnswersPercentage;
      data.audioCallNewWords = audioCallNewWords;
      data.audioCallLongestStreak = audioCallLongestStreak;
    console.log(learnedWords);
    const response = await userAccountApi.updateStatistics({learnedWords, optional: data});
    console.log(response.json());
  }
}

export default AudioCall;