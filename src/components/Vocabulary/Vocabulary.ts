import WordsApi from "../Api/WordsApi";
import Ebook from "../Ebook/Ebook";

export interface IObj<T> {
    [key: string]: T;
}

export interface IWordOptions {
    difficulty: string;
    optional: {
        wordData: IObj<string>
    };
}


class Vocabulary {
    activeTab: string;
    ebook: Ebook;
    wordsApi: WordsApi;
    difficultWords: IWordOptions[];
    learnedWords: IWordOptions[];
    difficultPage: number;
    learnedPage: number;

    constructor() {
        this.activeTab = 'difficultTab';
        this.ebook = new Ebook();
        this.wordsApi = new WordsApi();
        this.difficultWords = [];
        this.learnedWords = [];
        this.difficultPage = 1;
        this.learnedPage = 1;
    }

    async drawVocabulary() {
        const container = document.querySelector('.container__content') as HTMLDivElement;
        const vocabulary = document.createElement('div') as HTMLDivElement;
        vocabulary.className = 'vocabulary';
        vocabulary.append(this.createTabsBtns());
        await this.setWords();
        container.append(vocabulary);
        this.drawDifficultWords();
        this.drawLearnedWords();
    }

    drawDifficultWords() {
        const vocabulary = document.querySelector('.vocabulary') as HTMLDivElement;
        const difficultPage = document.createElement('div') as HTMLDivElement;
        difficultPage.className = "difficult-page";
        difficultPage.append(this.createPagenator(this.difficultWords, 'diff'));

        if (this.activeTab === 'difficultTab') {
            difficultPage.classList.add('active');
        }

        const wordsContainer = document.createElement('div') as HTMLDivElement;
        wordsContainer.className = 'difficult-page__words-block';
        const wordsToDraw = this.difficultWords.slice(this.difficultPage * 22 - 22, this.difficultPage * 22);

        wordsToDraw.forEach((word: IWordOptions) => {
            if (word.optional.wordData) {
                wordsContainer.append(this.ebook.createWordBlock(word.optional.wordData))
            }
        })

        difficultPage.append(wordsContainer);
        vocabulary.append(difficultPage);
    }
    async drawLearnedWords() {
        const vocabulary = document.querySelector('.vocabulary') as HTMLDivElement;
        const learnedPage = document.createElement('div') as HTMLDivElement;
        learnedPage.className = "learned-page";
        learnedPage.append(this.createPagenator(this.learnedWords, 'learned'));

        if (this.activeTab === 'learnedTab') {
            learnedPage.classList.add('active');
        }

        const wordsContainer = document.createElement('div') as HTMLDivElement;
        wordsContainer.className = 'learned-page__words-block';
        const wordsToDraw = this.learnedWords.slice(this.learnedPage * 22 - 22, this.learnedPage * 22);

        if (wordsToDraw.length < 1) {
            wordsContainer.textContent = 'Изученных слов нет.'
        }

        wordsToDraw.forEach((word: IWordOptions) => {
            if (word.optional.wordData) {
                wordsContainer.append(this.ebook.createWordBlock(word.optional.wordData))
            }
        })

        learnedPage.append(wordsContainer);
        vocabulary.append(learnedPage);
    }

    async setWords() {
        const response = await this.wordsApi.getUserWords();

        if (response.ok) {
            const words = await response.json();
            if (words.length > 0) {
                const difficultWords = words.filter((word: IWordOptions) => word.difficulty === 'hard' && word.optional.wordData)
                const learnedWords = words.filter((word: IWordOptions) => word.difficulty === 'easy' && word.optional.wordData)
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
        }

        if (type === 'learned') {
            page.textContent = `${this.learnedPage}`;
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
        console.log(totalPages);


        firstPageBtn.addEventListener('click', () => {
            const difficultPage = document.querySelector('.difficult-page') as HTMLDivElement;
            if (type === 'diff') {
                if (this.difficultPage !== 1) {
                    this.difficultPage = 1;
                    page.textContent = `${this.difficultPage}`;
                    difficultPage.outerHTML = '';
                    this.drawDifficultWords();
                }
            }
            const learnedPage = document.querySelector('.learned-page') as HTMLDivElement;
            if (type === 'learned') {
                if (this.learnedPage !== 1) {
                    this.learnedPage = 1;
                    page.textContent = `${this.learnedPage}`;
                    learnedPage.outerHTML = '';
                    this.drawLearnedWords();
                }
            }
        })

        prevPageBtn.addEventListener('click', () => {
            const difficultPage = document.querySelector('.difficult-page') as HTMLDivElement;
            if (type === 'diff') {
                if (this.difficultPage !== 1) {
                    this.difficultPage -= 1;
                    page.textContent = `${this.difficultPage}`;
                    difficultPage.outerHTML = '';
                    this.drawDifficultWords();
                }
            }

            const learnedPage = document.querySelector('.learned-page') as HTMLDivElement;
            if (type === 'learned') {
                if (this.learnedPage !== 1) {
                    this.learnedPage -= 1;
                    page.textContent = `${this.learnedPage}`;
                    learnedPage.outerHTML = '';
                    this.drawLearnedWords();
                }
            }
        })

        nextPageBtn.addEventListener('click', () => {
            const difficultPage = document.querySelector('.difficult-page') as HTMLDivElement;
            if (type === 'diff') {
                if (this.difficultPage !== totalPages) {
                    this.difficultPage += 1;
                    page.textContent = `${this.difficultPage}`;
                    difficultPage.outerHTML = '';
                    this.drawDifficultWords();
                }
            }

            const learnedPage = document.querySelector('.learned-page') as HTMLDivElement;
            if (type === 'learned') {
                if (this.learnedPage !== totalPages) {
                    this.learnedPage += 1;
                    page.textContent = `${this.learnedPage}`;
                    learnedPage.outerHTML = '';
                    this.drawLearnedWords();
                }
            }
        })

        lastPageBtn.addEventListener('click', () => {
            const difficultPage = document.querySelector('.difficult-page') as HTMLDivElement;
            if (type === 'diff') {
                if (this.difficultPage !== totalPages) {
                    this.difficultPage = totalPages;
                    page.textContent = `${this.difficultPage}`;
                    difficultPage.outerHTML = '';
                    this.drawDifficultWords();
                }
            }
            const learnedPage = document.querySelector('.learned-page') as HTMLDivElement;
            if (type === 'learned') {
                if (this.learnedPage !== totalPages) {
                    this.learnedPage = totalPages;
                    page.textContent = `${this.learnedPage}`;
                    learnedPage.outerHTML = '';
                    this.drawLearnedWords();
                }
            }
        })

        return pagenator;
    }
}

export default Vocabulary;