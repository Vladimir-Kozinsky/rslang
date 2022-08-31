class Vocabulary {
    activeTab: string;

    constructor() {
        this.activeTab = 'difficultTab';
    }

    drawVocabulary() {
        const container = document.querySelector('.container__content') as HTMLDivElement;
        const vocabulary = document.createElement('div') as HTMLDivElement;
        vocabulary.className = 'vocabulary';
        vocabulary.append(this.createTabsBtns());
        vocabulary.append(this.createPagenator());
        const wordsBlock = document.createElement('div') as HTMLDivElement;
        wordsBlock.className = 'vocabulary__words-block';
        container.append(vocabulary);
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
            if (this.activeTab !== 'difficultTab') {
                difficultTab.classList.add('active');
                learnedTab.classList.remove('active');
                this.activeTab = 'difficultTab';
            } 
        })

        learnedTab.addEventListener('click', () => {
            if (this.activeTab !== 'learnedTab') {
                learnedTab.classList.add('active');
                difficultTab.classList.remove('active');
                this.activeTab = 'learnedTab';
            } 
        })

        return tabsBlock;
    }



    createPagenator() {
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
        page.textContent = `${1}`;
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
            
        })

        prevPageBtn.addEventListener('click', () => {
           
        })

        nextPageBtn.addEventListener('click', () => {
            
        })

        lastPageBtn.addEventListener('click', () => {
            
        })

        return pagenator;
    }
}

export default Vocabulary;