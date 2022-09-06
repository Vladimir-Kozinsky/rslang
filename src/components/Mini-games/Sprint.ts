import ApiData from '../Api/ApiData';
import UserAccountApi from '../Api/UserAccountApi';
import App from '../App';
import BurgerMenuForNav from '../BurgerMenu/burgerMenuForNav';
import Container from '../Container/Container';
import  { IObj, IStatisticsOptions, Word } from '../types';
import GamesApi from './gamesApi';
import MiniGames from './MiniGames';

class Sprint {
  createPage() {
    const miniGames = new MiniGames();
    const content = document.querySelector('.container__content') as HTMLDivElement;

    const sprintContainer = document.createElement('div') as HTMLDivElement;
    sprintContainer.classList.add('sprint__container');

    const returnToPrevPage = document.createElement('div');
    returnToPrevPage.classList.add('return-to-prev-page');

    const title = document.createElement('h2') as HTMLHeadingElement;
    title.textContent = 'Спринт';

    const sprintstatisticsContainer = document.createElement('div') as HTMLDivElement;
    sprintstatisticsContainer.classList.add('sprint-statistics__container');

    const points = document.createElement('span') as HTMLSpanElement;
    points.textContent = '0';
    points.classList.add('sprint-statistics-point');

    const time = document.createElement('span') as HTMLSpanElement;
    time.textContent = '60';
    time.classList.add('sprint-statistics-time');

    const cart = document.createElement('div') as HTMLDivElement;
    cart.classList.add('sprint-cart');

    const audioContainer = document.createElement('div') as HTMLDivElement;
    audioContainer.classList.add('audio__container');

    const wordAudio = document.createElement('audio') as HTMLAudioElement;
    wordAudio.classList.add('word-audio');

    const wordAudioExample = document.createElement('audio') as HTMLAudioElement;
    wordAudioExample.classList.add('word-audio-example');

    const currentWordContainer = document.createElement('div') as HTMLDivElement;
    currentWordContainer.classList.add('sprint-current-word__container');

    for (let i = 0; i < 4; i += 1) {
      const comboDots = document.createElement('span');
      comboDots.classList.add('sprint-dots');
      currentWordContainer.append(comboDots);
    }

    const word = document.createElement('h3') as HTMLHeadingElement;
    word.classList.add('sprint-word');
    word.textContent = '';

    const translatedWord = document.createElement('h4') as HTMLHeadingElement;
    translatedWord.classList.add('sprint-translated-word');
    translatedWord.textContent = '';

    const question = document.createElement('span') as HTMLSpanElement;
    question.textContent = 'Перевод правильный?';
    question.classList.add('sprint-question');

    const falseBtn = document.createElement('button') as HTMLButtonElement;
    falseBtn.textContent = 'Неверно';
    falseBtn.classList.add('sprint-button__false');

    const trueBtn = document.createElement('button') as HTMLButtonElement;
    trueBtn.textContent = 'Верно';
    trueBtn.classList.add('sprint-button__true');

    returnToPrevPage.addEventListener('click', () => {
      miniGames.backToPage();
    });

    document.querySelector('aside')?.remove();
    content.append(sprintContainer);
    sprintContainer.append(returnToPrevPage);
    sprintContainer.append(title);
    sprintContainer.append(sprintstatisticsContainer);
    sprintContainer.append(cart);
    audioContainer.append(wordAudio);
    audioContainer.append(wordAudioExample);
    sprintstatisticsContainer.append(points);
    sprintstatisticsContainer.append(time);
    cart.append(audioContainer);
    cart.append(currentWordContainer);
    currentWordContainer.append(word);
    currentWordContainer.append(translatedWord);
    currentWordContainer.append(question);
    currentWordContainer.append(falseBtn);
    currentWordContainer.append(trueBtn);
  }

  async createWordsForGame(difficulty: string, page: number = -1) {
    const api = new GamesApi();
    let randomPage: string;

    // if game launched from menu choose random page
    if(page === -1) randomPage = Math.floor(Math.random() * 30).toString();
    else randomPage = page.toString();

    let wordsArr: Word[];

    // check is user guest or registered
    if(ApiData.userIsAuth) wordsArr = (await api.getUserAggregatedWords(ApiData.userId, ApiData.token, difficulty, randomPage))[0].paginatedResults;
    else wordsArr = await api.getWords(difficulty, randomPage);

    // create additional words if they are not enough
    if(wordsArr.length < 15 && +randomPage > 0) {
      const additionalWords: Word[] = (await api.getUserAggregatedWords(ApiData.userId, ApiData.token, difficulty, (+randomPage - 1).toString()))[0].paginatedResults;
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
      else {
        wordsArr[i].guessedRight = 0;
      }
 
    }

    // create counter which counts how many times user guessed right choice and delete words if it guessed right n times 
    // for (let i = 0; i < wordsArr.length; i += 1) {
    //   if(!wordsArr[i].guessedRight) {
    //     wordsArr[i].guessedRight = 0;
    //   }
    //   else if(wordsArr[i].guessedRight! >= 3 && wordsArr[i].difficulty === 'easy') {
    //     wordsArr.splice(i, 1);
    //   }
    //   else if(wordsArr[i].guessedRight! >= 5 && wordsArr[i].difficulty === 'hard') {
    //     wordsArr.splice(i, 1);
    //   }
    // }

    const wrongTranslatedWordsIndexes: number[] = [];
    function shuffleArr(array: Word[]) {
      let currentIndex = array.length;
      let randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }

      return array;
    }
    shuffleArr(wordsArr);

    const clonedArr: Word[] = JSON.parse(JSON.stringify(wordsArr));

    function shuffleTranslatedWords(arr: Word[]) {
      arr.forEach((item: Word) => {
        const random = Math.random();
        const randomIndex = Math.floor(Math.random() * arr.length);
        if (random > 0.7) {
          item.wordTranslate = arr[randomIndex].wordTranslate;
        }
      });
    }
    shuffleTranslatedWords(clonedArr);

    function findWrongTranslates(arr: Word[], shuffledArr: Word[]) {
      arr.forEach((item: Word, index: number) => {
        if (item.wordTranslate !== shuffledArr[index].wordTranslate) {
          wrongTranslatedWordsIndexes.push(index);
        }
      });
      return wrongTranslatedWordsIndexes;
    }
    findWrongTranslates(wordsArr, clonedArr);

    return { wordsArr, clonedArr, wrongTranslatedWordsIndexes };
  }

  async appendWordsToPage(difficulty: string, page: number = -1) {
    const wordContainer = document.querySelector('.sprint-current-word__container');
    const word = document.querySelector('.sprint-word') as HTMLHeadingElement;
    const translatedWord = document.querySelector('.sprint-translated-word') as HTMLHeadingElement;
    const wordAudio = document.querySelector('.word-audio');
    const wordAudioExample = document.querySelector('.word-audio-example');
    const points = document.querySelector('.sprint-statistics-point') as HTMLSpanElement;
    const time = document.querySelector('.sprint-statistics-time') as HTMLSpanElement;
    const createdWords = await this.createWordsForGame(difficulty, page);
    const { clonedArr } = createdWords;
    const { wordsArr } = createdWords;
    const correctAnswers: { word: string; wordTranslate: string; wordAudio: string; guessedRight?: number }[] = [];
    const inCorrectAnswers: { word: string; wordTranslate: string; wordAudio: string; guessedRight?: number }[] = [];
    const wrongTranslatedWordIndexes: number[] = createdWords.wrongTranslatedWordsIndexes;
    let currentIndex: number = 0;
    const currentWord: string = clonedArr[currentIndex].word;
    word.textContent = currentWord;
    translatedWord.textContent = clonedArr[currentIndex].wordTranslate;
    wordAudio!.innerHTML = `
    <source src="https://react-learnwords-shahzod.herokuapp.com/${clonedArr[currentIndex].audio}" type="audio/mpeg">
   `;
    wordAudioExample!.innerHTML = `
    <source src="https://react-learnwords-shahzod.herokuapp.com/${clonedArr[currentIndex].audioExample}" type="audio/mpeg">
   `;

   const api = new GamesApi();
   const token: string = localStorage.getItem('token')!;

    const timeToStop = setInterval(() => {
      time.textContent = (+time.textContent! - 1).toString();
      if (time.textContent === '0') {
        clearInterval(timeToStop);
        for (let i = 0; i < currentIndex; i += 1) {
          clonedArr[i].guessedRight = clonedArr[i].userWord?.optional.wordData.guessedRight; 
          delete clonedArr[i].userWord;
          // if user made mistake in word change guessedRight to 0
          if(!clonedArr[i].isTrue) clonedArr[i].guessedRight = 0;
          if(clonedArr[i].guessedRight! >= 3) api.createUpdateUserWord(ApiData.userId, token, clonedArr[i]._id!, clonedArr[i], 'easy')
          else api.createUpdateUserWord(ApiData.userId, token, clonedArr[i]._id!, clonedArr[i], 'hard');
        }
        this.createResultsPage(+points.textContent!, correctAnswers, inCorrectAnswers);
      }
    }, 1000);
    timeToStop;

    function findTranslate(origWord: string) {
      for (let i = 0; i < wordsArr.length; i += 1) {
        if (wordsArr[i].word === origWord) {
          return wordsArr[i].wordTranslate;
        }
      }
    }

    const trueAnswerAudio = new Audio('../../assets/audio/correct-sound.mp3');
    const falseAnswerAudio = new Audio('../../assets/audio/incorrect-sound.mp3');
    // Control from keyboard
    const controlFromKeyboard =  (e: KeyboardEvent) => {
      const keyName = e.key;
      if (currentIndex > 18) {
        clearInterval(timeToStop);
        callStatistics()
        this.createResultsPage(+points.textContent!, correctAnswers, inCorrectAnswers);
        for (let i = 0; i < clonedArr.length; i += 1) {
          clonedArr[i].guessedRight = clonedArr[i].userWord?.optional.wordData.guessedRight 
          delete clonedArr[i].userWord;
          // if user made mistake in word change guessedRight to 0
          if(!clonedArr[i].isTrue) clonedArr[i].guessedRight = 0;
          if(clonedArr[i].guessedRight! >= 3) api.createUpdateUserWord(ApiData.userId, token, clonedArr[i]._id!, clonedArr[i], 'easy')
          else api.createUpdateUserWord(ApiData.userId, token, clonedArr[i]._id!, clonedArr[i], 'hard');        }
      }
      // eslint-disable-next-line default-case
      switch (keyName) {
        case 'ArrowRight':
            if (wrongTranslatedWordIndexes.includes(currentIndex)) {
              word.textContent = clonedArr[currentIndex].word;
              translatedWord.textContent = clonedArr[currentIndex].wordTranslate;
              inCorrectAnswers.push({
                word: word.textContent!,
                wordTranslate: findTranslate(word.textContent!)!,
                wordAudio: clonedArr[currentIndex].audio,
                guessedRight: clonedArr[currentIndex].guessedRight
              });
              falseAnswerAudio.play();
              clonedArr[currentIndex].isTrue = false;
              currentIndex += 1;
              word.textContent = clonedArr[currentIndex].word;
              translatedWord.textContent = clonedArr[currentIndex].wordTranslate;
            } else {
              correctAnswers.push({
                word: word.textContent!,
                wordTranslate: translatedWord.textContent!,
                wordAudio: clonedArr[currentIndex].audio,
                guessedRight: clonedArr[currentIndex].guessedRight
              });
              trueAnswerAudio.play()
              clonedArr[currentIndex].isTrue = true;
              if(clonedArr[currentIndex].userWord) {
                clonedArr[currentIndex].userWord!.optional!.wordData!.guessedRight! += 1;
              }
              else clonedArr[currentIndex].guessedRight! += 1;
              currentIndex += 1;
              points.textContent = (+points.textContent! + 20).toString();
              word.textContent = clonedArr[currentIndex].word;
              translatedWord.textContent = clonedArr[currentIndex].wordTranslate;
            }
          break;
        case 'ArrowLeft':
          if (wrongTranslatedWordIndexes.includes(currentIndex)) {
            correctAnswers.push({
              word: word.textContent!,
              wordTranslate: findTranslate(word.textContent!)!,
              wordAudio: clonedArr[currentIndex].audio,
              guessedRight: clonedArr[currentIndex].guessedRight
            });
            trueAnswerAudio.play()
            clonedArr[currentIndex].isTrue = true;
            if(clonedArr[currentIndex].userWord) {
              clonedArr[currentIndex].userWord!.optional!.wordData!.guessedRight! += 1;
            }
            else clonedArr[currentIndex].guessedRight! += 1;
            currentIndex += 1;
            points.textContent = (+points.textContent! + 20).toString();
            word.textContent = clonedArr[currentIndex].word;
            translatedWord.textContent = clonedArr[currentIndex].wordTranslate;
          } else {
            inCorrectAnswers.push({
              word: word.textContent!,
              wordTranslate: translatedWord.textContent!,
              wordAudio: clonedArr[currentIndex].audio,
              guessedRight: clonedArr[currentIndex].guessedRight
            });
            falseAnswerAudio.play();
            clonedArr[currentIndex].isTrue = false;
            currentIndex += 1;
            word.textContent = clonedArr[currentIndex].word;
            translatedWord.textContent = clonedArr[currentIndex].wordTranslate;
          }
      }
    };
    document.addEventListener('keydown', controlFromKeyboard);

    const callStatistics = () => {
      const newWords: string  = (correctAnswers.length + inCorrectAnswers.length).toString();
      const correctAnswerPercentage: string = `${Math.round(100 / ((inCorrectAnswers.length + correctAnswers.length) / correctAnswers.length)).toString()}%`; 

      let streaksArr: number[][] = [];
      clonedArr.forEach((item: Word, index: number) => {
        if(index > 0) {
          if(item.isTrue && !clonedArr[index - 1].isTrue) streaksArr.push([1]);
          else if(item.isTrue && clonedArr[index - 1].isTrue) streaksArr[streaksArr.length - 1][0]++;
        }
        else if(item.isTrue) streaksArr.push([1]);
      });
      const longestStreak: string = streaksArr.sort((a, b) => b[0] - a[0])[0][0].toString();
      document.removeEventListener('keydown', controlFromKeyboard);
      this.sendDataToStatistics(correctAnswerPercentage, newWords, longestStreak);
    }

    // Control from mouse
    wordContainer?.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLButtonElement;
      if (currentIndex > 18) {
        clearInterval(timeToStop);
        // send user words to user/words
        for (let i = 0; i < clonedArr.length; i += 1) {
          clonedArr[i].guessedRight = clonedArr[i].userWord?.optional.wordData.guessedRight 
          delete clonedArr[i].userWord;
          // if user made mistake in word change guessedRight to 0
          if(!clonedArr[i].isTrue) clonedArr[i].guessedRight = 0;
          if(clonedArr[i].guessedRight! >= 3) api.createUpdateUserWord(ApiData.userId, token, clonedArr[i]._id!, clonedArr[i], 'easy')
          else api.createUpdateUserWord(ApiData.userId, token, clonedArr[i]._id!, clonedArr[i], 'hard');
        }
        callStatistics();
        document.removeEventListener('keydown', controlFromKeyboard);
        this.createResultsPage(+points.textContent!, correctAnswers, inCorrectAnswers);
      }
      if (target.classList.contains('sprint-button__true')) {
        if (wrongTranslatedWordIndexes.includes(currentIndex)) {
          word.textContent = clonedArr[currentIndex].word;
          translatedWord.textContent = clonedArr[currentIndex].wordTranslate;
          inCorrectAnswers.push({
            word: word.textContent!,
            wordTranslate: findTranslate(word.textContent!)!,
            wordAudio: clonedArr[currentIndex].audio,
            guessedRight: clonedArr[currentIndex].guessedRight
          });
          falseAnswerAudio.play();
          clonedArr[currentIndex].isTrue = false;
          currentIndex += 1;
          word.textContent = clonedArr[currentIndex].word;
          translatedWord.textContent = clonedArr[currentIndex].wordTranslate;
        } else {
          correctAnswers.push({
            word: word.textContent!,
            wordTranslate: translatedWord.textContent!,
            wordAudio: clonedArr[currentIndex].audio,
            guessedRight: clonedArr[currentIndex].guessedRight
          });
          trueAnswerAudio.play();
          clonedArr[currentIndex].isTrue = true;
          if(clonedArr[currentIndex].userWord) {
            clonedArr[currentIndex].userWord!.optional!.wordData!.guessedRight! += 1;
          }
          else clonedArr[currentIndex].guessedRight! += 1;
          currentIndex += 1;
          points.textContent = (+points.textContent! + 20).toString();
          word.textContent = clonedArr[currentIndex].word;
          translatedWord.textContent = clonedArr[currentIndex].wordTranslate;
        }
      } else if (target.classList.contains('sprint-button__false')) {
        if (wrongTranslatedWordIndexes.includes(currentIndex)) {
          correctAnswers.push({
            word: word.textContent!,
            wordTranslate: findTranslate(word.textContent!)!,
            wordAudio: clonedArr[currentIndex].audio,
            guessedRight: clonedArr[currentIndex].guessedRight
          });
          trueAnswerAudio.play();
          clonedArr[currentIndex].isTrue = true;
          if(clonedArr[currentIndex].userWord) {
            clonedArr[currentIndex].userWord!.optional!.wordData!.guessedRight! += 1;
          }
          else clonedArr[currentIndex].guessedRight! += 1;
          currentIndex += 1;
          points.textContent = (+points.textContent! + 20).toString();
          word.textContent = clonedArr[currentIndex].word;
          translatedWord.textContent = clonedArr[currentIndex].wordTranslate;
        } else {
          inCorrectAnswers.push({
            word: word.textContent!,
            wordTranslate: translatedWord.textContent!,
            wordAudio: clonedArr[currentIndex].audio,
            guessedRight: clonedArr[currentIndex].guessedRight
          });
          falseAnswerAudio.play();
          clonedArr[currentIndex].isTrue = false;
          currentIndex += 1;
          word.textContent = clonedArr[currentIndex].word;
          translatedWord.textContent = clonedArr[currentIndex].wordTranslate;
        }
      }
    });
  }

  createResultsPage(
    points: number,
    correctAnswers: { word: string; wordTranslate: string; wordAudio: string }[],
    inCorrectAnswers: { word: string; wordTranslate: string; wordAudio: string }[]
  ) {
    const burgerMenu = new BurgerMenuForNav();
    burgerMenu.createBurgerMenu();
    const content = document.querySelector('.container__content') as HTMLDivElement;
    const containerBlock = document.querySelector('.container') as HTMLDivElement;
    const app = new App();
    const container = new Container();
    containerBlock.prepend(container.createMenu());

    // remove class actve from nav__items and add class active to games link
    const links = document.querySelectorAll('.nav__item');
    links.forEach((link) => {
      link.classList.remove('active');
    });
    const link = document.querySelector('#games') as HTMLLIElement;
    link.parentElement!.parentElement!.classList.add('active');
    content.innerHTML = '';

    const resultsCartContainer = document.createElement('div');
    resultsCartContainer.classList.add('sprint-results-cart__container');
    resultsCartContainer.classList.add('results-cart__container');

    const resultsCart = document.createElement('div');
    resultsCart.classList.add('sprint-results-cart');
    resultsCart.classList.add('results-cart');

    const title = document.createElement('h2') as HTMLHeadingElement;
    title.textContent = 'Ваш результат:';

    const totalPoints = document.createElement('span') as HTMLSpanElement;
    totalPoints.classList.add('total-points');
    totalPoints.textContent = `${points.toString()} баллов`;

    const answersBlock = document.createElement('div') as HTMLDivElement;
    answersBlock.classList.add('sprint-results-answers-block');
    answersBlock.classList.add('results-answers-block');

    // audio plays when clicking to the icon
    answersBlock.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLDivElement;
      if(target.classList.contains('correct-answer__audio') || target.classList.contains('inCorrect-answer__audio')) {
        const audio = target.children[0] as HTMLAudioElement;
        audio.play();
      }
    })    
    const correctAnswersContainer = document.createElement('div') as HTMLDivElement;

    const correctAnswersTotal = document.createElement('span') as HTMLSpanElement;
    correctAnswersTotal.classList.add('sprint-results-correct-answers-total');
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
      <source src="https://react-learnwords-shahzod.herokuapp.com/${correctAnswers[i].wordAudio}" type="">
    </audio>`;
      correctAnswerWord.textContent = `${correctAnswers[i].word} - ${correctAnswers[i].wordTranslate}`;
      correctAnswersContainer.append(correctAnswerBlock);
      correctAnswerBlock.append(answerAudio);
      correctAnswerBlock.append(correctAnswerWord);
    }

    const inCorrectAnswersContainer = document.createElement('div') as HTMLDivElement;

    const inCorrectAnswersTotal = document.createElement('span') as HTMLSpanElement;
    inCorrectAnswersTotal.classList.add('sprint-results-incorrect-answers-total');
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
        <source src="https://react-learnwords-shahzod.herokuapp.com/${inCorrectAnswers[i].wordAudio}" type="">
      </audio>`;
      inCorrectAnswerWord.textContent = `${inCorrectAnswers[i].word} - ${inCorrectAnswers[i].wordTranslate}`;
      inCorrectAnswersContainer.append(inCorrectAnswerBlock);
      inCorrectAnswerBlock.append(answerAudio);
      inCorrectAnswerBlock.append(inCorrectAnswerWord);
    }

    content.append(resultsCartContainer);
    resultsCartContainer.append(resultsCart);
    resultsCart.append(title);
    resultsCart.append(totalPoints);
    resultsCart.append(answersBlock);
    answersBlock.append(correctAnswersContainer);
    answersBlock.append(inCorrectAnswersContainer);
    correctAnswersContainer.prepend(correctAnswersTotal);
    inCorrectAnswersContainer.prepend(inCorrectAnswersTotal);

    app.switchToAnotherPage();
  }

  async sendDataToStatistics(sprintCorrectAnswersPercentage: string, sprintNewWords: string, sprintLongestStreak: string) {
    const userAccountApi = new UserAccountApi();
    const RequestGetStatistics= await userAccountApi.getStatistics();

    let data: IObj<string>;
    let learnedWords: number;
    if(RequestGetStatistics.ok) {
      const getStatistics  = await RequestGetStatistics.json(); 
      // eslint-disable-next-line no-unsafe-optional-chaining
      learnedWords = getStatistics.learnedWords + +document.querySelector('.sprint-results-answers-block')?.children[0].children.length! - 1;
      data = getStatistics.optional;
    }
    else {
      // eslint-disable-next-line no-unsafe-optional-chaining
      learnedWords = +document.querySelector('.sprint-results-answers-block')?.children[0].children.length! - 1;
      data = {
          sprintCorrectAnswersPercentage,
          sprintNewWords,
          sprintLongestStreak 
      }
}

    if(data.sprintCorrectAnswersPercentage) {
      const prevCorrectAnswersPercentage: number = +data.sprintCorrectAnswersPercentage.slice(0, -1);
      const prevNewWords: number = +data.sprintNewWords;
      const prevLongestStreak: number = +data.sprintLongestStreak;
      sprintCorrectAnswersPercentage = `${Math.round(((+sprintCorrectAnswersPercentage.slice(0, -1) + prevCorrectAnswersPercentage) / 2)).toString()}%`;
      sprintNewWords = (+sprintNewWords + prevNewWords).toString();
      if(prevLongestStreak > +sprintLongestStreak) {
         sprintLongestStreak = prevLongestStreak.toString()
      };
    }

      data.sprintCorrectAnswersPercentage = sprintCorrectAnswersPercentage;
      data.sprintNewWords = sprintNewWords;
      data.sprintLongestStreak = sprintLongestStreak;
    

    // eslint-disable-next-line no-unsafe-optional-chaining
    const response = await userAccountApi.updateStatistics({learnedWords, optional: data});
  }
}

export default Sprint;
