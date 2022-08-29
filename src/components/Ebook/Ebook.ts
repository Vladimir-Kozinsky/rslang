import EbookAPI, { IWord } from "../API/API";


class Ebook {
    async drawEbook() {
        const container = document.querySelector('.container__content') as HTMLDivElement;
        const ebook = document.createElement('div') as HTMLDivElement;
        ebook.className = 'ebook';

        ebook.append(this.drawHeader());
        ebook.append(await this.drawWords());

        container.append(ebook);
    }

    async drawWords() {
        const data = await EbookAPI.getWords('0', '0');
        const ebookWords = document.createElement('div') as HTMLDivElement;
        ebookWords.className = 'ebook__words'
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

        const wordBlockImgWrap = document.createElement('div') as HTMLDivElement;
        wordBlockImgWrap.className = 'word-block__img-wrap';

        const wordBlockImg = document.createElement('img') as HTMLImageElement;
        wordBlockImg.src = `http://localhost:6666/${item.image}`;

        wordBlockImgWrap.append(wordBlockImg);

        const filterBlock = document.createElement('div') as HTMLDivElement;
        filterBlock.className = 'word-block__filter';
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

        const pagenator = document.createElement('div') as HTMLDivElement;
        pagenator.className = 'pagenator';
        header.append(pagenator);

        header.append(this.createHeaderMenu());

        return header;
    }

    createHeaderMenu() {

        const sections = [
            { text: '1 Секция', bg: 'green', size: '90px' },
            { text: '2 Секция', bg: '#00ef00', size: '100px' },
            { text: '3 Секция', bg: 'yellow', size: '110px' },
            { text: '4 Секция', bg: 'orange', size: '120px' },
            { text: '5 Секция', bg: 'green', size: '130px' },
            { text: '6 Секция', bg: 'red', size: '140px' },
            { text: '7 Секция', bg: '#3c365a', size: '150px' }
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
        menuItem.addEventListener('click', () => {
            const menuItems = document.querySelectorAll('.header-menu__item');
            menuItems.forEach(item => {
                item.classList.remove('active');
            })
            menuItem.classList.add('active');
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

}

export default Ebook;