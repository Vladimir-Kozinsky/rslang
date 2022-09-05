/* eslint-disable no-underscore-dangle */
import ApiData from "../Api/ApiData";
import WordsApi from "../Api/WordsApi";
import AudioCall from "../Mini-games/AudioCall";
import Sprint from "../Mini-games/Sprint";
import Spinner from "../Spinner/spinner";
import { IObj, IWordOptions } from "../types";
import Vocabulary from "../Vocabulary/Vocabulary";


export interface IWord {
    "id": string;
    "group": number;
    "page": number;
    "word": string;
    "image": string;
    "audio": string;
    "audioMeaning": string;
    "audioExample": string;
    "textMeaning": string;
    "textExample": string;
    "transcription": string;
    "textExampleTranslate": string;
    "textMeaningTranslate": string;
    "wordTranslate": string;
}


class Ebook {
    group: number;

    page: number;

    totalPages: string;

    theme: string;

    wordsApi: WordsApi;

    userWords: IWordOptions[];

    sprint: Sprint;

    spinner: Spinner;

    audioCall: AudioCall;

    constructor() {
        this.group = 0;
        this.page = 0;
        this.totalPages = '30';
        this.theme = '#3c365a';
        this.wordsApi = new WordsApi();
        this.userWords = [];
        this.sprint = new Sprint();
        this.audioCall = new AudioCall();
        this.spinner = new Spinner();
    }

    async drawEbook() {
        const container = document.querySelector('.container__content') as HTMLDivElement;
        const ebook = document.createElement('div') as HTMLDivElement;
        ebook.className = 'ebook';

        if (ApiData.userIsAuth) {
            await this.setUserWords();
        }

        console.log(this.userWords)
        ebook.append(this.drawHeader());
        ebook.append(await this.drawWords());

        container.append(ebook);
    }

    async drawWords(group: number = this.group, page: number = this.page) {
        const responce = await this.wordsApi.getChunkWords(group, page);
        let ebookWords = document.querySelector('.ebook__words') as HTMLDivElement;

        if (!ebookWords) {
            ebookWords = document.createElement('div') as HTMLDivElement;
            ebookWords.className = 'ebook__words'
        } else {
            while (ebookWords.firstChild) {
                ebookWords.removeChild(ebookWords.firstChild);
            }
        }

        if (responce.ok) {
            const words = await responce.json();
            words.forEach((item: IObj<string>) => {
                const isHard = this.userWords.find(word => word.optional.wordData ? word.optional.wordData.id === item.id && word.difficulty === 'hard' : false);
                const isEasy = this.userWords.find(word => word.optional.wordData ? word.optional.wordData.id === item.id && word.difficulty === 'easy' : false);
                ebookWords.append(this.createWordBlock(item, isHard, isEasy));
            })
        }
        return ebookWords;
    }

    createWordBlock(item: IObj<string>, isHard: IWordOptions | undefined, isEasy: IWordOptions | undefined, type?: string) {
        const wordBlock = document.createElement('div') as HTMLDivElement;
        wordBlock.className = 'word-block';
        wordBlock.style.background = this.theme;

        const wordBlockImgWrap = document.createElement('div') as HTMLDivElement;
        wordBlockImgWrap.className = 'word-block__img-wrap';

        const wordBlockImg = document.createElement('img') as HTMLImageElement;
        wordBlockImg.src = `${ApiData.basePath}/${item.image}`;

        wordBlockImgWrap.append(wordBlockImg);

        const filterBlock = document.createElement('div') as HTMLDivElement;
        filterBlock.className = 'word-block__filter';
        filterBlock.style.background = `linear-gradient(transparent, ${this.theme})`;
        if (ApiData.userIsAuth) {
            const difficultBtn = document.createElement('button') as HTMLButtonElement;
            const vocabulary = new Vocabulary();
            difficultBtn.className = 'word-block__difficult-btn';
            difficultBtn.textContent = isHard ? 'В сложных' : 'В сложные';
            difficultBtn.style.background = this.theme;
            if (isHard) {
                difficultBtn.style.borderColor = '#9cfc0d';
                difficultBtn.style.color = '#9cfc0d';
                difficultBtn.disabled = true;
            }

            const learnedtBtn = document.createElement('button') as HTMLButtonElement;
            learnedtBtn.className = 'word-block__learned-btn';
            learnedtBtn.textContent = isEasy ? 'В изученных' : 'В изученные';
            learnedtBtn.style.background = this.theme;
            if (isEasy) {
                learnedtBtn.style.borderColor = '#9cfc0d';
                learnedtBtn.style.color = '#9cfc0d';
                learnedtBtn.disabled = true;
            }

            difficultBtn.addEventListener('click', async () => {
                const wordOptions = {
                    difficulty: "hard",
                    optional: {
                        wordData: item
                    }
                }
                const response = await this.wordsApi.createUserWord(item.id, wordOptions);
                if (response.ok) {
                    difficultBtn.style.borderColor = '#9cfc0d';
                    difficultBtn.style.color = '#9cfc0d';
                    difficultBtn.disabled = true;
                    learnedtBtn.style.borderColor = 'white';
                    learnedtBtn.style.color = 'white';
                    learnedtBtn.disabled = false;
                    console.log('word succesfully added to hard')
                } else {
                    const response = await this.wordsApi.updateUserWord(item.id, wordOptions);
                    if (response.ok) {
                        difficultBtn.style.borderColor = '#9cfc0d';
                        difficultBtn.style.color = '#9cfc0d';
                        difficultBtn.disabled = true;
                        learnedtBtn.style.borderColor = 'white';
                        learnedtBtn.style.color = 'white';
                        learnedtBtn.disabled = false;
                        console.log('word succesfully updated to hard');
                    }
                }
            })

            learnedtBtn.addEventListener('click', async () => {
                const wordOptions = {
                    difficulty: "easy",
                    optional: {
                        wordData: item
                    }
                }

                const response = await this.wordsApi.createUserWord(item.id, wordOptions);
                if (response.ok) {
                    learnedtBtn.style.borderColor = '#9cfc0d';
                    learnedtBtn.style.color = '#9cfc0d';
                    learnedtBtn.disabled = true;
                    difficultBtn.disabled = false;
                    difficultBtn.style.borderColor = 'white';
                    difficultBtn.style.color = 'white';
                    console.log('word succesfully added to easy');
                } else {
                    const response = await this.wordsApi.updateUserWord(item.id, wordOptions);
                    if (response.ok) {
                        learnedtBtn.style.borderColor = '#9cfc0d';
                        learnedtBtn.style.color = '#9cfc0d';
                        learnedtBtn.disabled = true;
                        difficultBtn.disabled = false;
                        difficultBtn.style.borderColor = 'white';
                        difficultBtn.style.color = 'white';
                        console.log('word succesfully updated to easy');
                    }
                }
            })
            if (type === 'hard') {
                const deleteFromHardBtn = document.createElement('button') as HTMLButtonElement;
                deleteFromHardBtn.className = 'word-block__difficult-btn';
                deleteFromHardBtn.textContent = 'Удалить';
                deleteFromHardBtn.style.background = this.theme;
                deleteFromHardBtn.addEventListener('click', async () => {
                    await this.wordsApi.deleteUserWord(item.id);
                    const difficultWordsContainer = document.querySelector('.difficult-page__words-block') as HTMLDivElement;
                    difficultWordsContainer.outerHTML = '';
                    await Vocabulary.setWords();
                    vocabulary.activeTab = 'difficultTab';
                    const pagenator = document.querySelector('.vocabulary-pagenator__difficult-page');
                    let padeNumber;
                    if (pagenator?.textContent) {
                        padeNumber = pagenator.textContent;
                        vocabulary.drawDifficultWords(+padeNumber);
                    }

                })
                filterBlock.append(deleteFromHardBtn);
            }

            if (type === 'easy') {
                const deleteFromLearnedBtn = document.createElement('button') as HTMLButtonElement;
                deleteFromLearnedBtn.className = 'word-block__difficult-btn';
                deleteFromLearnedBtn.textContent = 'Удалить';
                deleteFromLearnedBtn.style.background = this.theme;
                deleteFromLearnedBtn.addEventListener('click', async () => {
                    await this.wordsApi.deleteUserWord(item.id);
                    const learnedWordsContainer = document.querySelector('.learned-page__words-block') as HTMLDivElement;
                    learnedWordsContainer.outerHTML = '';
                    await Vocabulary.setWords();
                    vocabulary.activeTab = 'learnedTab';
                    const pagenator = document.querySelector('.vocabulary-pagenator__learned-page');
                    let padeNumber;
                    if (pagenator?.textContent) {
                        padeNumber = pagenator.textContent;
                        vocabulary.drawLearnedWords(+padeNumber);
                    }
                })
                filterBlock.append(deleteFromLearnedBtn);
            }

            if (!type) {
                filterBlock.append(difficultBtn);
                filterBlock.append(learnedtBtn);
            }



        }
        wordBlock.append(filterBlock);
        wordBlock.append(wordBlockImgWrap);

        const wordBlockInfo = document.createElement('div') as HTMLDivElement;
        wordBlockInfo.className = 'word-block__info';

        const word = document.createElement('h4') as HTMLHeadElement;
        word.className = 'info-block__word';
        word.textContent = item.word;
        wordBlockInfo.append(word);

        const transcription = document.createElement('span') as HTMLSpanElement;
        transcription.className = 'info-block__word-trans';
        transcription.textContent = item.wordTranslate;
        wordBlockInfo.append(transcription);

        const wordTranslate = document.createElement('span') as HTMLSpanElement;
        wordTranslate.className = 'info-block__word-transcript';
        wordTranslate.textContent = item.transcription;
        wordBlockInfo.append(wordTranslate);

        const voiceIcon = document.createElement('img') as HTMLImageElement;
        voiceIcon.className = 'info-block__voice-icon';
        voiceIcon.src = '../../assets/img/svg/voice-icon.svg';
        voiceIcon.addEventListener('click', () => {
            const audio = new Audio(`${ApiData.basePath}/${item.audioExample}`);
            voiceIcon.src = '../../assets/img/svg/voice-icon-active.svg'
            audio.play();
            audio.onended = () => {
                voiceIcon.src = '../../assets/img/svg/voice-icon.svg'
            }
        })
        wordBlockInfo.append(voiceIcon);

        const textExample = document.createElement('p') as HTMLParagraphElement;
        textExample.className = 'info-block__text-example';
        textExample.innerHTML = item.textExample;
        wordBlockInfo.append(textExample);

        const textMeaning = document.createElement('p') as HTMLParagraphElement;
        textMeaning.className = 'info-block__text-meaning';
        textMeaning.innerHTML = item.textMeaning;
        wordBlockInfo.append(textMeaning);

        const line = document.createElement('hr') as HTMLHRElement;
        line.className = 'info-block__line';
        wordBlockInfo.append(line);

        const textExampleTranslate = document.createElement('p') as HTMLParagraphElement;
        textExampleTranslate.className = 'info-block__text-example-trans';
        textExampleTranslate.innerHTML = item.textExampleTranslate;
        wordBlockInfo.append(textExampleTranslate);

        const textMeaningTranslate = document.createElement('p') as HTMLParagraphElement;
        textMeaningTranslate.className = 'info-block__text-meaning-trans';
        textMeaningTranslate.innerHTML = item.textMeaningTranslate;
        wordBlockInfo.append(textMeaningTranslate);
        wordBlock.append(wordBlockInfo);

        return wordBlock;
    }

    drawHeader() {
        const header = document.createElement('div') as HTMLDivElement;
        header.className = 'ebook-header';

        const miniGames = document.createElement('div') as HTMLDivElement;
        miniGames.className = 'ebook-header__mimi-games';

        const sprint = document.createElement('div') as HTMLDivElement;
        sprint.className = 'sprint-game';
        sprint.addEventListener('click', () => {
            const content = document.querySelector('.container__content') as HTMLDivElement;
            content.innerHTML = '';
            this.sprint.createPage();
            this.sprint.appendWordsToPage(this.group.toString(), this.page);
            this.spinner.createPage();
        })

        const sprintImg = document.createElement('img') as HTMLImageElement;
        sprintImg.className = 'sprint-game__img';
        sprintImg.src = '../../assets/img/png/sneaker.png'
        sprint.append(sprintImg);

        const sprintTitle = document.createElement('h4') as HTMLHeadingElement;
        sprintTitle.className = 'sprint-game__title';
        sprintTitle.textContent = 'Спринт';
        sprint.append(sprintTitle);

        const audioCall = document.createElement('div') as HTMLDivElement;
        audioCall.className = 'audioCall-game';
        audioCall.addEventListener('click', () => {
            const content = document.querySelector('.container__content') as HTMLDivElement;
            content.innerHTML = '';
            this.audioCall.createPage();
            this.audioCall.appendDataToPage(this.group.toString(), this.page);
            this.spinner.createPage();

        })

        const audioCallImg = document.createElement('img') as HTMLImageElement;
        audioCallImg.className = 'audioCall-game__img';
        audioCallImg.src = '../../assets/img/png/headphones.png'
        audioCall.append(audioCallImg);

        const audioCallTitle = document.createElement('h4') as HTMLHeadingElement;
        audioCallTitle.className = 'audioCall-game__title';
        audioCallTitle.textContent = 'Аудиовызов';
        audioCall.append(audioCallTitle);

        miniGames.append(sprint);
        miniGames.append(audioCall);
        header.append(miniGames);


        header.append(this.createPagenator());

        header.append(this.createHeaderMenu());

        return header;
    }

    createHeaderMenu() {

        const sections = [
            { text: '1 Секция', bg: '#3c365a', size: '90px' },
            { text: '2 Секция', bg: '#563E20', size: '100px' },
            { text: '3 Секция', bg: '#1E434C', size: '110px' },
            { text: '4 Секция', bg: '#BA5536', size: '120px' },
            { text: '5 Секция', bg: '#004D47', size: '130px' },
            { text: '6 Секция', bg: '#053538', size: '140px' },
            { text: '7 Секция', bg: '#896E69', size: '150px' }
        ]
        const headerMenu = document.createElement('div') as HTMLDivElement;
        headerMenu.className = 'header-menu';

        // const menuIcon = document.createElement('div') as HTMLDivElement;
        // menuIcon.className = 'header-menu__icon';

        const menuItems = document.createElement('ul');
        menuItems.className = 'header-menu__items';
        menuItems.addEventListener('click', () => {
            menuItems.classList.toggle('active');
        })

        sections.forEach(item => {
            menuItems.append(this.createMenuItem(item.text, item.bg, item.size));
        })

        headerMenu.append(menuItems);
        return headerMenu;
    }

    createMenuItem(text: string, bg: string, size: string) {
        const menuItem = document.createElement('li') as HTMLElement;
        menuItem.className = 'header-menu__item';
        menuItem.addEventListener('click', async (event) => {
            const currentMenuItem = event.currentTarget as HTMLElement;
            if (!currentMenuItem.classList.contains('active')) {
                const menuItems = document.querySelectorAll('.header-menu__item');
                menuItems.forEach(item => {
                    item.classList.remove('active');
                })
                if (currentMenuItem.textContent) {
                    let group: number = +currentMenuItem.textContent.split('')[0];
                    if (group) {
                        group -= 1;
                    }
                    this.group = group;
                    this.theme = bg;
                    menuItem.classList.add('active');
                    await this.drawWords(group, this.page);
                }
            }
        })

        const link = document.createElement('a') as HTMLElement;
        link.className = 'header-menu__item__link';
        link.textContent = text
        menuItem.append(link);

        if (text === '1 Секция') {
            menuItem.classList.add('active');
        }

        menuItem.style.width = size;
        menuItem.style.background = bg;
        return menuItem;
    }

    createPagenator() {
        const pagenator = document.createElement('div') as HTMLDivElement;
        pagenator.className = 'pagenator';

        const firstPageBtn = document.createElement('img') as HTMLImageElement;
        firstPageBtn.className = 'pagenator__page-btn pagenator__page-btn__first';
        firstPageBtn.src = '../../assets/img/svg/pagenatorBtnDoubleLeft.svg';
        pagenator.append(firstPageBtn);

        const prevPageBtn = document.createElement('img') as HTMLImageElement;
        prevPageBtn.className = 'pagenator__page-btn pagenator__page-btn__prev';
        prevPageBtn.src = '../../assets/img/svg/pagenatorBtn.svg';
        pagenator.append(prevPageBtn);

        const page = document.createElement('span') as HTMLSpanElement;
        page.className = 'pagenator__page';
        page.textContent = `${+this.page + 1}`;
        pagenator.append(page);

        const nextPageBtn = document.createElement('img') as HTMLImageElement;
        nextPageBtn.className = 'pagenator__page-btn pagenator__page-btn__next';
        nextPageBtn.src = '../../assets/img/svg/pagenatorBtn.svg';
        pagenator.append(nextPageBtn);

        const lastPageBtn = document.createElement('img') as HTMLImageElement;
        lastPageBtn.className = 'pagenator__page-btn pagenator__page-btn__last';
        lastPageBtn.src = '../../assets/img/svg/pagenatorBtnDoubleRight.svg';
        pagenator.append(lastPageBtn);

        firstPageBtn.addEventListener('click', () => {
            if (this.page !== 0) {
                this.drawWords(this.group, 0);
                page.textContent = '1';
                this.page = 0;
            }
        })

        prevPageBtn.addEventListener('click', () => {
            if (this.page !== 0) {
                this.drawWords(this.group, this.page - 1);
                page.textContent = this.page.toString();
                this.page -= 1;
            }
        })

        nextPageBtn.addEventListener('click', () => {
            if (this.page !== 29) {
                this.drawWords(this.group, this.page + 1);
                page.textContent = `${this.page + 2}`;
                this.page += 1;
            }
        })

        lastPageBtn.addEventListener('click', () => {
            if (this.page !== 29) {
                this.drawWords(this.group, 29);
                page.textContent = '30';
                this.page = 29;
            }
        })

        return pagenator;
    }

    async setUserWords() {
        const response = await this.wordsApi.getUserWords();
        if (response.ok) {
            this.userWords = await response.json();
        } else {
            console.log('user words have not recieved')
        }
    }

}

export default Ebook;