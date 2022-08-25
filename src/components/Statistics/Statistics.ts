/* eslint-disable class-methods-use-this */
import StatsWidget from "./StatsWidget/StatsWidget";
import userFemale from "../../assets/img/svg/user-female.svg"

interface ISatsData {
    name: string;
    unit: string;
    value: number | undefined;
}

const statsData: ISatsData[] = [
    {
        name: 'Колличество изученных слов сегодня',
        unit: 'Слов',
        value: 11
    },
    {
        name: 'Процент  правильных ответов сегодня',
        unit: '%',
        value: undefined
    },
    {
        name: 'Колличество новых слов сегодня',
        unit: 'Слов',
        value: 15
    },
]

class Statistics {
    userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    drawStatistics() {
        const container = document.querySelector('.container__content') as HTMLDivElement;
        const statistics = document.createElement('div') as HTMLDivElement;
        statistics.className = 'stats';

        const statsWrap = document.createElement('div') as HTMLDivElement;
        statsWrap.className = 'stats-wrap';

        statistics.append(this.createStatsBlock("Статистика", statsData));
        statistics.append(this.createStatsBlock("Aудиовызов", statsData));
        statistics.append(this.createStatsBlock("Спринт", statsData));

        statsWrap.append(statistics);
        statsWrap.append(this.createUserBlock());
        statsWrap.append(this.createLinksBlock());

        container.append(statsWrap);
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow
    createStatsBlock(header: string, statsData: ISatsData[]) {
        const statsBlock = document.createElement('div') as HTMLDivElement;
        statsBlock.className = 'stats-block';

        const statsBlockHeader = document.createElement('h3') as HTMLHeadingElement;
        statsBlockHeader.className = 'stats-block__header';

        const widgetsContainer = document.createElement('div') as HTMLDivElement;
        widgetsContainer.className = 'widgets-container';

        statsBlockHeader.textContent = header;
        statsBlock.append(statsBlockHeader)

        const widget = new StatsWidget();
        statsData.forEach(item => {
            widgetsContainer.append(widget.createWidget(item.name, item.unit, item.value));
        })

        statsBlock.append(widgetsContainer)
        return statsBlock;
    }

    createUserBlock() {

        const userStatsData = [
            { text: 'Изученные слова', value: '146' },
            { text: 'Попыток', value: '2' }
        ]

        const userBlock = document.createElement('div') as HTMLDivElement;
        userBlock.className = 'user-block';


        const userPhotoBlock = document.createElement('div') as HTMLDivElement;
        userPhotoBlock.className = 'user-block__photo';

        const userPhoto = document.createElement('img') as HTMLImageElement;
        userPhoto.src = userFemale
        userPhotoBlock.append(userPhoto);

        const userInfoBlock = document.createElement('div') as HTMLDivElement;
        userInfoBlock.className = 'user-block__info'

        const userName = document.createElement('h4') as HTMLHeadingElement;
        userName.className = 'info-block__name';
        userName.textContent = 'Annie Leonchart'
        userInfoBlock.append(userName);

        const userEmail = document.createElement('h4') as HTMLHeadingElement;
        userEmail.className = 'info-block__email';
        userEmail.textContent = 'annie_leonchart@mail.com'
        userInfoBlock.append(userEmail);

        const userStatsCont = document.createElement('div') as HTMLDivElement;
        userStatsCont.className = 'user-stats__container';

        userStatsData.forEach(item => {
            const userStats = document.createElement('div') as HTMLDivElement;

            userStats.className = 'user-stats__block'

            const userStatsHeader = document.createElement('span') as HTMLSpanElement;
            userStatsHeader.className = 'user-stats__header';
            userStatsHeader.textContent = item.text;
            userStats.append(userStatsHeader);

            const userStatsValue = document.createElement('span') as HTMLSpanElement;
            userStatsValue.className = 'user-stats__value'
            userStatsValue.textContent = item.value;
            userStats.append(userStatsValue);

            userStatsCont.append(userStats);
        })

        userInfoBlock.append(userStatsCont);
        userBlock.append(userInfoBlock);
        userBlock.append(userPhotoBlock);

        return userBlock;
    }

    createLinksBlock() {
        const linksBlock = document.createElement('div') as HTMLDivElement;
        linksBlock.className = 'links-block';

        const links = [
            { title: 'Аудиовызов', image: 'headphone.svg' },
            { title: 'Спринт', image: 'sneaker.svg' },
            { title: 'Словарь', image: 'book.svg' },
        ]

        links.forEach(item => {
            const linkBlock = document.createElement('div') as HTMLDivElement;
            linkBlock.className = 'link-block';

            const linkBlockImgWrap = document.createElement('div') as HTMLDivElement;
            linkBlockImgWrap.className = 'link-block-wrap';

            const linkBlockImg = document.createElement('img') as HTMLImageElement;
            linkBlockImg.className = 'link-block__img';
            linkBlockImg.src = `./../../assets/img/svg/${item.image}`;
            linkBlockImgWrap.append(linkBlockImg);

            linkBlock.append(linkBlockImgWrap);

            const linkBlockTitle = document.createElement('h4') as HTMLHeadingElement;
            linkBlockTitle.className = 'link-block__title';
            linkBlockTitle.textContent = item.title;
            linkBlock.append(linkBlockTitle);

            linksBlock.append(linkBlock);
        })



        return linksBlock;
    }


}

export default Statistics;