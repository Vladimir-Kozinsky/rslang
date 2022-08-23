import Container from '../Container/Container';
import Word from '../interfaces/interfaces';
import GamesApi from './gamesApi';

class Sprint {
  createPage() {
    const content = document.querySelector(
      '.container__content'
    ) as HTMLDivElement;

    const sprintContainer = document.createElement('div') as HTMLDivElement;
    sprintContainer.classList.add('sprint__container');

    const title = document.createElement('h2') as HTMLHeadingElement;
    title.textContent = 'Спринт';

    const sprintstatisticsContainer = document.createElement(
      'div'
    ) as HTMLDivElement;
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

    const currentWordContainer = document.createElement(
      'div'
    ) as HTMLDivElement;
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

    document.querySelector('aside')?.remove();
    content.append(sprintContainer);
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

  async createWordsForGame(difficulty: string) {
    const api = new GamesApi();
    const randomPage = Math.floor(Math.random() * 30).toString();
    const wordsArr: Word[] = await api.getWords(difficulty, randomPage);
    const wrongTranslatedWordsIndexes: number[] = [];
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
  
  async appendWordsToPage(difficulty: string) {
    const wordContainer = document.querySelector(
      '.sprint-current-word__container'
    );
    const word = document.querySelector('.sprint-word') as HTMLHeadingElement;
    const translatedWord = document.querySelector(
      '.sprint-translated-word'
    ) as HTMLHeadingElement;
    const wordAudio = document.querySelector('.word-audio');
    const wordAudioExample = document.querySelector('.word-audio-example');
    const points = document.querySelector(
      '.sprint-statistics-point'
    ) as HTMLSpanElement;
    const time = document.querySelector(
      '.sprint-statistics-time'
    ) as HTMLSpanElement;
    const createdWords = await this.createWordsForGame(difficulty);
    const {clonedArr} = createdWords;
    const {wordsArr} = createdWords;
    const correctAnswers: { word: string; wordTranslate: string }[] = [];
    const inCorrectAnswers: { word: string; wordTranslate: string }[] = [];
    const wrongTranslatedWordIndexes: number[] =
      createdWords.wrongTranslatedWordsIndexes;
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

    const timeToStop = setInterval(() => {
      time.textContent = (+time.textContent! - 1).toString();
      if (time.textContent === '0') {
        clearInterval(timeToStop);
        this.createResultsPage(+points.textContent!, correctAnswers, inCorrectAnswers);
      }
    }, 1000);
    timeToStop;

    function findTranslate(origWord: string) {
     for (let i = 0; i < wordsArr.length; i += 1) {
      if(wordsArr[i].word === origWord) {
        return wordsArr[i].wordTranslate;
      }
     }
    }
    wordContainer?.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLButtonElement;
      if(currentIndex > 18) {
        clearInterval(timeToStop);
        this.createResultsPage(+points.textContent!, correctAnswers, inCorrectAnswers);
      }
      if (target.classList.contains('sprint-button__true')) {
        if (wrongTranslatedWordIndexes.includes(currentIndex)) {
          currentIndex += 1;
          word.textContent = clonedArr[currentIndex].word;
          translatedWord.textContent = clonedArr[currentIndex].wordTranslate;
          inCorrectAnswers.push({
            word: word.textContent!,
            wordTranslate: findTranslate(word.textContent!)!
          })
        } else {
          correctAnswers.push({
            word: word.textContent!,
            wordTranslate: translatedWord.textContent!,
          });
          currentIndex += 1;
          points.textContent = (+points.textContent! + 20).toString();
          word.textContent = clonedArr[currentIndex].word;
          translatedWord.textContent = clonedArr[currentIndex].wordTranslate;
        }
      } else if (target.classList.contains('sprint-button__false')) {
        if (wrongTranslatedWordIndexes.includes(currentIndex)) {
          correctAnswers.push({
            word: word.textContent!,
            wordTranslate: findTranslate(word.textContent!)!
          })
          currentIndex += 1;
          points.textContent = (+points.textContent! + 20).toString();
          word.textContent = clonedArr[currentIndex].word;
          translatedWord.textContent = clonedArr[currentIndex].wordTranslate;
        } else {
          inCorrectAnswers.push({
            word: word.textContent!,
            wordTranslate: translatedWord.textContent!,
          });
          currentIndex += 1;
          word.textContent = clonedArr[currentIndex].word;
          translatedWord.textContent = clonedArr[currentIndex].wordTranslate;
        }
      }
    });
  }
 
  createResultsPage(points: number, correctAnswers: { word: string; wordTranslate: string }[], inCorrectAnswers: { word: string; wordTranslate: string }[]) {
    const content = document.querySelector(
      '.container__content'
    ) as HTMLDivElement;
    const containerBlock = document.querySelector(
      '.container'
    ) as HTMLDivElement;
    const container = new Container();
    containerBlock.prepend(container.createMenu());
    content.innerHTML = '';
    
    const resultsCartContainer = document.createElement('div');
    resultsCartContainer.classList.add('sprint-results-cart__container');

    const resultsCart = document.createElement('div');
    resultsCart.classList.add('sprint-results-cart');
    
    const title = document.createElement('h2') as HTMLHeadingElement;
    title.textContent = 'Ваш результат:'

    const totalPoints = document.createElement('span') as HTMLSpanElement;
    totalPoints.classList.add('total-points');
    totalPoints.textContent = `${points.toString()} баллов`;

    const answersBlock = document.createElement('div') as HTMLDivElement;
    answersBlock.classList.add('sprint-results-answers-block');

    const correctAnswersContainer = document.createElement('div') as HTMLDivElement;
    
    const correctAnswersTotal = document.createElement('span') as HTMLSpanElement;
    correctAnswersTotal.classList.add('sprint-results-correct-answers-total');
    correctAnswersTotal.textContent = `Правильные ответы:${(correctAnswers.length).toString()}`;

    for (let i = 0; i < correctAnswers.length; i += 1) {
      const correctAnswerBlock = document.createElement('div') as HTMLDivElement;
      correctAnswerBlock.classList.add('correct-answer__block')
      const answerAudio = document.createElement('audio') as HTMLAudioElement;
      answerAudio.classList.add('correct-answer__audio')
      const correctAnswerWord = document.createElement('span') as HTMLSpanElement;
      correctAnswerWord.classList.add('correct-answer__word')

      correctAnswerWord.textContent = `${correctAnswers[i].word} - ${correctAnswers[i].wordTranslate}`;
      correctAnswersContainer.append(correctAnswerBlock)
      correctAnswerBlock.append(answerAudio);
      correctAnswerBlock.append(correctAnswerWord);
    }

    const inCorrectAnswersContainer = document.createElement('div') as HTMLDivElement;

    const inCorrectAnswersTotal = document.createElement('span') as HTMLSpanElement;
    inCorrectAnswersTotal.classList.add('sprint-results-incorrect-answers-total');
    inCorrectAnswersTotal.textContent = `Неправильные ответы:${(inCorrectAnswers.length)}`;   
    
    for (let i = 0; i < inCorrectAnswers.length; i += 1) {
      const inCorrectAnswerBlock = document.createElement('div') as HTMLDivElement;
      inCorrectAnswerBlock.classList.add('inCorrect-answer__block')
      const answerAudio = document.createElement('audio') as HTMLAudioElement;
      answerAudio.classList.add('inCorrect-answer__audio')
      const inCorrectAnswerWord = document.createElement('span') as HTMLSpanElement;
      inCorrectAnswerWord.classList.add('inCorrect-answer__word')

      inCorrectAnswerWord.textContent = `${inCorrectAnswers[i].word} - ${inCorrectAnswers[i].wordTranslate}`;
      inCorrectAnswersContainer.append(inCorrectAnswerBlock)
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
   correctAnswersContainer.prepend(correctAnswersTotal)
   inCorrectAnswersContainer.prepend(inCorrectAnswersTotal);

  }

}

export default Sprint;
