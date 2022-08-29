import EbookAPI, { IWord } from "../API/API";

class Ebook {
    group: string;

    page: string;

    totalPages: string;

    isAuth: boolean;

    theme: string;

    constructor() {
        this.group = '0';
        this.page = '0';
        this.totalPages = '30';
        this.isAuth = true;
        this.theme = '#3c365a';
    }

    async drawEbook() {
        const container = document.querySelector('.container__content') as HTMLDivElement;
        const ebook = document.createElement('div') as HTMLDivElement;
        ebook.className = 'ebook';

        ebook.append(this.drawHeader());
        ebook.append(await this.drawWords());

        container.append(ebook);
    }

    async drawWords(group: string = this.group, page: string = this.page) {
        const data = await EbookAPI.getWords(group, page);
        let ebookWords = document.querySelector('.ebook__words') as HTMLDivElement;

        if (!ebookWords) {
            ebookWords = document.createElement('div') as HTMLDivElement;
            ebookWords.className = 'ebook__words'
        } else {
            while (ebookWords.firstChild) {
                ebookWords.removeChild(ebookWords.firstChild);
            }
        }

        if (data && data.status === 'OK') {
            data.words.forEach((item: IWord) => {
                ebookWords.append(this.createWordBlock(item));
            })
        }
        return ebookWords;
    }

    createWordBlock(item: IWord) {
        const wordBlock = document.createElement('div') as HTMLDivElement;
        wordBlock.className = 'word-block';
        wordBlock.style.background = this.theme;

        const wordBlockImgWrap = document.createElement('div') as HTMLDivElement;
        wordBlockImgWrap.className = 'word-block__img-wrap';

        const wordBlockImg = document.createElement('img') as HTMLImageElement;
        wordBlockImg.src = `http://localhost:6666/${item.image}`;

        wordBlockImgWrap.append(wordBlockImg);



        const filterBlock = document.createElement('div') as HTMLDivElement;
        filterBlock.className = 'word-block__filter';
        filterBlock.style.background = `linear-gradient(transparent, ${this.theme})`;
        if (this.isAuth) {
            const difficultBtn = document.createElement('button') as HTMLButtonElement;
            difficultBtn.className = 'word-block__difficult-btn';
            difficultBtn.textContent = 'В сложные';
            difficultBtn.style.background = this.theme;

            const learnedtBtn = document.createElement('button') as HTMLButtonElement;
            learnedtBtn.className = 'word-block__learned-btn';
            learnedtBtn.textContent = 'В изученные';
            learnedtBtn.style.background = this.theme;
            filterBlock.append(difficultBtn);
            filterBlock.append(learnedtBtn);
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
            const audio = new Audio(`http://localhost:6666/${item.audioExample}`);
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

        const headerLogo = document.createElement('div') as HTMLDivElement;
        header.append(headerLogo);


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


                    let group = currentMenuItem.textContent.split('')[0];
                    if (group) {
                        group = (+group - 1).toString();
                    }
                    this.group = group;
                    this.theme = bg;
                    await this.drawWords(group, this.page);
                    menuItem.classList.add('active');
                }
            }
        })

        const link = document.createElement('a') as HTMLElement;
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
            if (this.page !== '0') {
                this.drawWords(this.group, '0');
                page.textContent = '1';
                this.page = '0';
            }
        })

        prevPageBtn.addEventListener('click', () => {
            if (this.page !== '0') {
                this.drawWords(this.group, (+this.page - 1).toString());
                page.textContent = this.page;
                this.page = `${+this.page - 1}`;
            }
        })

        nextPageBtn.addEventListener('click', () => {
            if (this.page !== '29') {
                this.drawWords(this.group, (+this.page + 1).toString());
                page.textContent = `${+this.page + 2}`;
                this.page = `${+this.page + 1}`;
            }
        })

        lastPageBtn.addEventListener('click', () => {
            if (this.page !== '29') {
                this.drawWords(this.group, '29');
                page.textContent = '30';
                this.page = '29';
            }
        })

        return pagenator;
    }

}

export default Ebook;