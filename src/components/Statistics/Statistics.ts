/* eslint-disable class-methods-use-this */
import StatsWidget from "./StatsWidget/StatsWidget";
import AuthController from "../Auth/AuthController";
import userFemale from "../../assets/img/svg/user-female.svg"
import { IObj, userPersonalData } from '../types';

interface IWidgetsData {
    name: string;
    unit: string;
    value?: number;
}

const widgetsData: IWidgetsData[] = [
    {
        name: 'Колличество изученных слов сегодня',
        unit: 'Слов',
    },
    {
        name: 'Процент  правильных ответов сегодня',
        unit: '%',
    },
    {
        name: 'Колличество новых слов сегодня',
        unit: 'Слов',
    },
]

interface IStats {
    statsCorrectAnswersPercentage: number;
    statsNewWords: number;
    statsLongestStreak: number;
}
interface IAudiocall {
    audioCallCorrectAnswersPercentage: number;
    audioCallNewWords: number;
    audioCallLongestStreak: number;
}

interface ISprint {
    sprintCorrectAnswersPercentage: number;
    sprintNewWords: number;
    sprintLongestStreak: number;
}

interface IStatsData {
    stats: IStats;
    audiocall: IAudiocall;
    sprint: ISprint;
}

class Statistics {
    authController: AuthController;
    
    userId: string;
    elements: IObj<HTMLElement>;

    statsData: IStatsData;


    constructor(userId: string) {
        this.authController = new AuthController();
        this.userId = userId;
        this.elements = {};
        this.statsData = {
            stats: {
                statsCorrectAnswersPercentage: 1,
                statsNewWords: 1,
                statsLongestStreak: 1
            },
            audiocall: {
                audioCallCorrectAnswersPercentage: 2,
                audioCallNewWords: 2,
                audioCallLongestStreak: 2
            },
            sprint: {
                sprintCorrectAnswersPercentage: 3,
                sprintNewWords: 3,
                sprintLongestStreak: 3
            }
        }
    }

    async drawStatistics() {
       // await this.setStatistics();
        const container = document.querySelector('.container__content') as HTMLDivElement;
        const statistics = document.createElement('div') as HTMLDivElement;
        statistics.className = 'stats';

        const statsWrap = document.createElement('div') as HTMLDivElement;
        statsWrap.className = 'stats-wrap';

        statistics.append(this.createStatsBlock("Статистика", widgetsData));
        statistics.append(this.createStatsBlock("Aудиовызов", widgetsData));
        statistics.append(this.createStatsBlock("Спринт", widgetsData,));

        statsWrap.append(statistics);
        statsWrap.append(this.createUserBlock());
        statsWrap.append(this.createLinksBlock());
        console.log(document.querySelector('.info-block__name'))
        container.append(statsWrap);
        
        const drawGuestUserView = this.drawGuestUserView.bind(this);
        const drawAuthUserView = this.drawAuthUserView.bind(this);
        this.authController.getStartScreen(drawGuestUserView, drawAuthUserView);
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow
    createStatsBlock(header: string, widgetsData: IWidgetsData[]) {
        const statsBlock = document.createElement('div') as HTMLDivElement;
        statsBlock.className = 'stats-block';

        const statsBlockHeader = document.createElement('h3') as HTMLHeadingElement;
        statsBlockHeader.className = 'stats-block__header';

        const widgetsContainer = document.createElement('div') as HTMLDivElement;
        widgetsContainer.className = 'widgets-container';

        statsBlockHeader.textContent = header;
        statsBlock.append(statsBlockHeader)

        switch (header) {
            case "Статистика":
                widgetsData[0].value = this.statsData.stats.statsCorrectAnswersPercentage;
                widgetsData[1].value = this.statsData.stats.statsLongestStreak;
                widgetsData[2].value = this.statsData.stats.statsNewWords;
                break;
            case "Aудиовызов":
                widgetsData[0].value = this.statsData.audiocall.audioCallCorrectAnswersPercentage;
                widgetsData[1].value = this.statsData.audiocall.audioCallLongestStreak;
                widgetsData[2].value = this.statsData.audiocall.audioCallNewWords;
                break;
            case "Спринт":
                widgetsData[0].value = this.statsData.sprint.sprintCorrectAnswersPercentage;
                widgetsData[1].value = this.statsData.sprint.sprintLongestStreak;
                widgetsData[2].value = this.statsData.sprint.sprintNewWords;
                break;

            default:
                break;
        }

        const widget = new StatsWidget();
        widgetsData.forEach(item => {
            widgetsContainer.append(widget.createWidget(item.name, item.unit, item.value));
        })

        statsBlock.append(widgetsContainer)
        return statsBlock;
    }

    createUserBlock() {
        const userBlock = document.createElement('div') as HTMLDivElement;
        userBlock.className = 'user-block';

        const userPhotoBlock = document.createElement('div') as HTMLDivElement;
        userPhotoBlock.className = 'user-block__photo';

        const userInfoBlock = document.createElement('div') as HTMLDivElement;
        userInfoBlock.className = 'user-block__info'

        userBlock.append(userInfoBlock);
        userBlock.append(userPhotoBlock);

        Object.assign(this.elements, {
            userPhotoBlock,
            userInfoBlock,
        });
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

    drawGuestUserView(): HTMLButtonElement {
        const { userPhotoBlock, userInfoBlock } = this.elements;        

        userPhotoBlock.innerHTML = '';
        userInfoBlock.innerHTML = '';

        const userIconWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        userIconWrapper.classList.add('user-icon-wrapper');
        const userIcon = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        userIcon.classList.add('user-icon');
        userIcon.setAttribute('href', './assets/img/svg/sprite.svg#guest-user');
        userIconWrapper.append(userIcon);
        userPhotoBlock.append(userIconWrapper);

        const userName = document.createElement('h4') as HTMLHeadingElement;
        userName.className = 'info-block__name';
        userName.textContent = 'Гость';
        userInfoBlock.append(userName);

        const signInButton = document.createElement('button');
        signInButton.classList.add('user-block__signin-button');
        signInButton.textContent = 'Войти';
        userInfoBlock.append(signInButton);

        const logOutButton = document.querySelector('.middleBlock__logout-button');
        if (logOutButton) {
            logOutButton.remove();
        }

        Object.assign(this.elements, {
            signInButton,
        })

        return signInButton;
    }

    drawAuthUserView(userPersonalData: userPersonalData): HTMLButtonElement {
        const { userPhotoBlock, userInfoBlock } = this.elements;
        const userStatsData = [
            { text: 'Изученные слова', value: '146' },
            { text: 'Попыток', value: '2' }
        ]

        userPhotoBlock.innerHTML = '';
        userInfoBlock.innerHTML = '';

        const userPhoto = document.createElement('img') as HTMLImageElement;
        if (userPersonalData.gender === 'male') {
            userPhoto.src = './assets/img/svg/user-male.svg';
        } else {
            userPhoto.src = './assets/img/svg/user-female.svg';
        }
        userPhotoBlock.append(userPhoto);

        const logoutNavItem = document.getElementById('logout');
        if (logoutNavItem) logoutNavItem.remove();

        const userName = document.createElement('h4') as HTMLHeadingElement;
        userName.className = 'info-block__name';
        userName.textContent = userPersonalData.name;

        const navList = document.querySelector('.nav__list') as HTMLElement;
        const navItem = document.createElement('li') as HTMLLIElement;
        navItem.classList.add('nav__item');
        navItem.id = 'logout';

        const middle = document.createElement('div') as HTMLDivElement;
        middle.className = 'middleBlock';

        const menuIcon = document.createElement('img') as HTMLImageElement;
        menuIcon.className = 'middleBlock__icon';
        menuIcon.src = `./assets/img/svg/exitIcon.svg`;

        const logOutButton = document.createElement('button') as HTMLButtonElement;
        logOutButton.classList.add('middleBlock__logout-button');
        logOutButton.textContent = 'Выйти';

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

        userInfoBlock.append(userName);
        userInfoBlock.append(userStatsCont);
         
        logOutButton.append(menuIcon);
        middle.append(logOutButton);
        navItem.append(middle);
        navList.append(navItem);

        return logOutButton;
    }

    // async setStatistics() {
    //     const response = await API.getStatistics(this.userId);
    //     if (response.ok) {
    //         const statistics = response.json();
    //         const audiocallStats = statistics.optional.audiocall;
    //         const sprintStats = statistics.optional.sprint;
    //         const mainStats = statistics.optional.stats;
    //         this.statsData = {
    //             audiocall: {
    //                 audioCallCorrectAnswersPercentage: audiocallStats.audioCallCorrectAnswersPercentage,
    //                 audioCallNewWords: audiocallStats.audioCallNewWords,
    //                 audioCallLongestStreak: audiocallStats.audioCallLongestStreak
    //             },
    //             sprint: {
    //                 sprintCorrectAnswersPercentage: sprintStats.sprintCorrectAnswersPercentage,
    //                 sprintNewWords: sprintStats.sprintNewWords,
    //                 sprintLongestStreak: sprintStats.sprintLongestStreak
    //             }
    //         }
    //     }
    // }

}

export default Statistics;