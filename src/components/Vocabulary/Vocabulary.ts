import ApiData from "../Api/ApiData";
import WordsApi from "../Api/WordsApi";
import Ebook from "../Ebook/Ebook";
import { IWordOptions } from "../types";

// export interface IObj<T> {
//     [key: string]: T;
// }

// export interface IWordOptions {
//     difficulty: string;
//     optional: {
//         wordData: IObj<string>
//     };
// }


class Vocabulary {
    activeTab: string;

    ebook: Ebook;

    wordsApi: WordsApi;

    difficultPage: number;

    learnedPage: number;

    static difficultWords = [];

    static learnedWords = [];

    constructor() {
        this.activeTab = 'difficultTab';
        this.ebook = new Ebook();
        this.wordsApi = new WordsApi();
        this.difficultPage = 1;
        this.learnedPage = 1;
    }

    async drawVocabulary() {
        const container = document.querySelector('.container__content') as HTMLDivElement;
        if (ApiData.userIsAuth) {
            const vocabulary = document.createElement('div') as HTMLDivElement;
            vocabulary.className = 'vocabulary';
            vocabulary.append(this.createTabsBtns());
            await Vocabulary.setWords();
            container.append(vocabulary);
            this.createDifficultPage();
            this.createLearnedPage();
        } else {
            container.style.display = 'flex';
            container.style.justifyContent = 'center';
            container.style.alignItems = 'center';

            const messageBlock = document.createElement('div') as HTMLDivElement;
            messageBlock.className = 'vocabulary__message';
            const textMessage = document.createElement('h4') as HTMLHeadElement;
            textMessage.className = 'vocabulary__message__text';
            textMessage.textContent = 'Авторизируйтесь';
            messageBlock.append(textMessage);
            const img = document.createElement('img') as HTMLImageElement;
            img.className = 'vocabulary__message__img';
            img.src = "../../assets/img/svg/lock.svg";
            messageBlock.append(img);
            container.append(messageBlock)
        }

    }

    createDifficultPage() {
        const vocabulary = document.querySelector('.vocabulary') as HTMLDivElement;
        const difficultPage = document.createElement('div') as HTMLDivElement;
        difficultPage.className = "difficult-page";
        difficultPage.append(this.createPagenator(Vocabulary.difficultWords, 'diff'));

        if (this.activeTab === 'difficultTab') {
            difficultPage.classList.add('active');
        }

        vocabulary.append(difficultPage);
        this.drawDifficultWords();
    }

    drawDifficultWords(padeNumber?: number) {
        const difficultPage = document.querySelector('.difficult-page') as HTMLDivElement;
        const wordsContainer = document.createElement('div') as HTMLDivElement;
        wordsContainer.className = 'difficult-page__words-block';
        const difficultPageNumber = padeNumber || this.difficultPage;

        const wordsToDraw = Vocabulary.difficultWords.slice(difficultPageNumber * 22 - 22, difficultPageNumber * 22);


        wordsToDraw.forEach((word: IWordOptions) => {
            if (word.optional.wordData) {
                wordsContainer.append(this.ebook.createWordBlock(word.optional.wordData, undefined, undefined, 'hard'));
            }
        })

        difficultPage.append(wordsContainer)
    }

    createLearnedPage() {
        const vocabulary = document.querySelector('.vocabulary') as HTMLDivElement;
        const learnedPage = document.createElement('div') as HTMLDivElement;
        learnedPage.className = "learned-page";
        learnedPage.append(this.createPagenator(Vocabulary.learnedWords, 'learned'));

        if (this.activeTab === 'learnedTab') {
            learnedPage.classList.add('active');
        }

        vocabulary.append(learnedPage);
        this.drawLearnedWords();
    }

    async drawLearnedWords(padeNumber?: number) {
        const learnedPage = document.querySelector('.learned-page') as HTMLDivElement;
        const wordsContainer = document.createElement('div') as HTMLDivElement;
        wordsContainer.className = 'learned-page__words-block';
        const learnedPageNumber = padeNumber || this.learnedPage;
        const wordsToDraw = Vocabulary.learnedWords.slice(learnedPageNumber * 22 - 22, learnedPageNumber * 22);

        if (wordsToDraw.length < 1) {
            wordsContainer.textContent = 'Изученных слов нет.'
        }

        wordsToDraw.forEach((word: IWordOptions) => {
            if (word.optional.wordData) {
                wordsContainer.append(this.ebook.createWordBlock(word.optional.wordData, undefined, undefined, 'easy'))
            }
        })

        learnedPage.append(wordsContainer);
    }

    static async setWords() {
        const wordsApi = new WordsApi()
        const response = await wordsApi.getUserWords();

        if (response.ok) {
            const words = await response.json();
            if (words.length > 0) {
                const difficultWords = words.filter((word: IWordOptions) => word.difficulty === 'hard')
                const learnedWords = words.filter((word: IWordOptions) => word.difficulty === 'easy')
                this.difficultWords = difficultWords;
                this.learnedWords = learnedWords;
            }

        }
    }

    createTabsBtns() {
        const tabsBlock = document.createElement('div') as HTMLDivElement;
        tabsBlock.className = 'tabs-block';

        const difficultTab = document.createElement('div') as HTMLDivElement;
        difficultTab.className = 'difficult-tab ';
        difficultTab.textContent = 'Сложные'

        tabsBlock.append(difficultTab);

        const learnedTab = document.createElement('div') as HTMLDivElement;
        learnedTab.className = 'learned-tab';
        learnedTab.textContent = 'Изученные'
        tabsBlock.append(learnedTab);

        if (this.activeTab === 'difficultTab') {
            difficultTab.classList.add('active');
            learnedTab.classList.remove('active');
        } else {
            difficultTab.classList.remove('active');
            learnedTab.classList.add('active');
        }


        difficultTab.addEventListener('click', () => {
            const difficultPage = document.querySelector('.difficult-page') as HTMLDivElement;
            const lernedPage = document.querySelector('.learned-page') as HTMLDivElement;
            if (this.activeTab !== 'difficultTab') {
                difficultTab.classList.add('active');
                difficultPage.classList.add('active');
                lernedPage.classList.remove('active');
                learnedTab.classList.remove('active');
                this.activeTab = 'difficultTab';
            }
        })

        learnedTab.addEventListener('click', () => {
            const difficultPage = document.querySelector('.difficult-page') as HTMLDivElement;
            const lernedPage = document.querySelector('.learned-page') as HTMLDivElement;
            if (this.activeTab !== 'learnedTab') {
                learnedTab.classList.add('active');
                lernedPage.classList.add('active');
                difficultPage.classList.remove('active');
                difficultTab.classList.remove('active');
                this.activeTab = 'learnedTab';
            }
        })

        return tabsBlock;
    }

    createPagenator(words: IWordOptions[], type: string) {
        const pagenator = document.createElement('div') as HTMLDivElement;
        pagenator.className = 'vocabulary-pagenator pagenator';

        const firstPageBtn = document.createElement('img') as HTMLImageElement;
        firstPageBtn.className = 'pagenator__page-btn pagenator__page-btn__first';
        firstPageBtn.src = '../../assets/img/svg/pagenatorBtnDoubleLeft.svg';
        pagenator.append(firstPageBtn);

        const prevPageBtn = document.createElement('img') as HTMLImageElement;
        prevPageBtn.className = 'pagenator__page-btn pagenator__page-btn__prev';
        prevPageBtn.src = '../../assets/img/svg/pagenatorBtn.svg';
        pagenator.append(prevPageBtn);

        const page = document.createElement('span') as HTMLSpanElement;
        page.className = 'pagenator__page vocabulary-pagenator__page';

        if (type === 'diff') {
            page.textContent = `${this.difficultPage}`;
            page.classList.add('vocabulary-pagenator__difficult-page');
        }

        if (type === 'learned') {
            page.textContent = `${this.learnedPage}`;
            page.classList.add('vocabulary-pagenator__learned-page');
        }

        pagenator.append(page);

        const nextPageBtn = document.createElement('img') as HTMLImageElement;
        nextPageBtn.className = 'pagenator__page-btn pagenator__page-btn__next';
        nextPageBtn.src = '../../assets/img/svg/pagenatorBtn.svg';
        pagenator.append(nextPageBtn);

        const lastPageBtn = document.createElement('img') as HTMLImageElement;
        lastPageBtn.className = 'pagenator__page-btn pagenator__page-btn__last';
        lastPageBtn.src = '../../assets/img/svg/pagenatorBtnDoubleRight.svg';
        pagenator.append(lastPageBtn);

        const totalPages = Math.floor(words.length / 22) + 1;

        firstPageBtn.addEventListener('click', () => {
            const difficultWordsContainer = document.querySelector('.difficult-page__words-block') as HTMLDivElement;
            if (type === 'diff') {
                if (this.difficultPage !== 1) {
                    this.difficultPage = 1;
                    page.textContent = `${this.difficultPage}`;
                    difficultWordsContainer.outerHTML = '';
                    this.drawDifficultWords();
                }
            }
            const learnedWordsContainer = document.querySelector('.learned-page__words-block') as HTMLDivElement;
            if (type === 'learned') {
                if (this.learnedPage !== 1) {
                    this.learnedPage = 1;
                    page.textContent = `${this.learnedPage}`;
                    learnedWordsContainer.outerHTML = '';
                    this.drawLearnedWords();
                }
            }
        })

        prevPageBtn.addEventListener('click', () => {
            const difficultWordsContainer = document.querySelector('.difficult-page__words-block') as HTMLDivElement;
            if (type === 'diff') {
                if (this.difficultPage !== 1) {
                    this.difficultPage -= 1;
                    page.textContent = `${this.difficultPage}`;
                    difficultWordsContainer.outerHTML = '';
                    this.drawDifficultWords();
                }
            }

            const learnedWordsContainer = document.querySelector('.learned-page__words-block') as HTMLDivElement;
            if (type === 'learned') {
                if (this.learnedPage !== 1) {
                    this.learnedPage -= 1;
                    page.textContent = `${this.learnedPage}`;
                    learnedWordsContainer.outerHTML = '';
                    this.drawLearnedWords();
                }
            }
        })

        nextPageBtn.addEventListener('click', () => {
            const difficultWordsContainer = document.querySelector('.difficult-page__words-block') as HTMLDivElement;
            if (type === 'diff') {
                if (this.difficultPage !== totalPages) {
                    this.difficultPage += 1;
                    page.textContent = `${this.difficultPage}`;
                    difficultWordsContainer.outerHTML = '';
                    this.drawDifficultWords();
                }
            }

            const learnedWordsContainer = document.querySelector('.learned-page__words-block') as HTMLDivElement;
            if (type === 'learned') {
                if (this.learnedPage !== totalPages) {
                    this.learnedPage += 1;
                    page.textContent = `${this.learnedPage}`;
                    learnedWordsContainer.outerHTML = '';
                    this.drawLearnedWords();
                }
            }
        })

        lastPageBtn.addEventListener('click', () => {
            const difficultWordsContainer = document.querySelector('.difficult-page__words-block') as HTMLDivElement;
            if (type === 'diff') {
                if (this.difficultPage !== totalPages) {
                    this.difficultPage = totalPages;
                    page.textContent = `${this.difficultPage}`;
                    difficultWordsContainer.outerHTML = '';
                    this.drawDifficultWords();
                }
            }
            const learnedWordsContainer = document.querySelector('.learned-page__words-block') as HTMLDivElement;
            if (type === 'learned') {
                if (this.learnedPage !== totalPages) {
                    this.learnedPage = totalPages;
                    page.textContent = `${this.learnedPage}`;
                    learnedWordsContainer.outerHTML = '';
                    this.drawLearnedWords();
                }
            }
        })

        return pagenator;
    }
}

export default Vocabulary;