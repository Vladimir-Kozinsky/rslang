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
  }

export default Sprint;
