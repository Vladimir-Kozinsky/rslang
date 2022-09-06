/* eslint-disable class-methods-use-this */
import { IObj, userPersonalData } from '../types';
import StatsWidget from "./StatsWidget/StatsWidget";
import AuthController from "../Auth/AuthController";
import userFemale from "../../assets/img/svg/user-female.svg"
import userMale from "../../assets/img/svg/user-male.svg"
import UserAccountApi from "../Api/UserAccountApi";
import ApiData from "../Api/ApiData";
import MiniGames from "../Mini-games/MiniGames";
import Ebook from "../Ebook/Ebook";

interface IWidgetsData {
    name: string;
    unit: string;
    value?: number;
}

const widgetsData: IWidgetsData[] = [
    {
        name: 'Колличество новых слов сегодня',
        unit: 'Слов',
    },
    {
        name: 'Процент  правильных ответов сегодня',
        unit: '%',
    },
    {
        name: 'Самая длинная серия',
        unit: 'Слов',
    },
]

interface IStatsData {
    statsCorrectAnswersPercentage: number | null,
    statsNewWords: number | null,
    statsLongestStreak: number | null,
    audioCallCorrectAnswersPercentage: number | null,
    audioCallNewWords: number | null,
    audioCallLongestStreak: number | null,
    sprintCorrectAnswersPercentage: number | null,
    sprintNewWords: number | null,
    sprintLongestStreak: number | null,
}

class Statistics {
    authController: AuthController;

    userId: string;
    elements: IObj<HTMLElement>;

    statsData: IStatsData;
    userAccountApi: UserAccountApi;
    miniGames: MiniGames;
    ebook: Ebook;


    constructor(userId: string) {
        this.authController = new AuthController();
        this.ebook = new Ebook();
        this.miniGames = new MiniGames();
        this.userAccountApi = new UserAccountApi();
        this.userId = userId;
        this.elements = {};
        this.statsData = {
            statsCorrectAnswersPercentage: null,
            statsNewWords: null,
            statsLongestStreak: null,
            audioCallCorrectAnswersPercentage: null,
            audioCallNewWords: null,
            audioCallLongestStreak: null,
            sprintCorrectAnswersPercentage: null,
            sprintNewWords: null,
            sprintLongestStreak: null,
        }
    }

    async drawStatistics() {
        await this.setStatistics();
        const container = document.querySelector('.container__content') as HTMLDivElement;
        const statistics = document.createElement('div') as HTMLDivElement;
        statistics.className = 'stats';

        const statsWrap = document.createElement('div') as HTMLDivElement;
        statsWrap.className = 'stats-wrap';

        statsWrap.append(statistics);
        statsWrap.append(this.createUserBlock());
        statsWrap.append(this.createLinksBlock());
        console.log(document.querySelector('.info-block__name'))
        container.append(statsWrap);

        Object.assign(this.elements, {
            statistics,
        })

        const authWindow = document.querySelector('.auth-blackout');
        if (authWindow) authWindow.remove();

        const drawGuestUserView = this.drawGuestUserView.bind(this);
        const drawAuthUserView = this.drawAuthUserView.bind(this);
        this.authController.getStartScreen(drawGuestUserView, drawAuthUserView);

        const footer = document.createElement('footer');
        footer.classList.add('footer');
        footer.insertAdjacentHTML(
            'afterbegin',
            `
            <span class="footer__copyright">© 2022</span>
            <ul class="developers-social-list">
                <li class="developers-social-item">
                    <a href="https://github.com/Vladimir-Kozinsky" class="developers-social-item__link">Vladimir-Kozinsky</a>
                </li>

                <li class="developers-social-item">
                    <a href="https://github.com/ShahzodK" class="developers-social-item__link">ShahzodK</a>
                </li>

                <li class="developers-social-item">
                    <a href="https://github.com/ScaronTr" class="developers-social-item__link">ScaronTr</a>
                </li>
            </ul>
            <a href="https://rs.school/js/" class="school-link">
                <svg class="school-link__icon-wrapper">
                    <use href="./assets/img/svg/sprite.svg#rss-logo" class="school-link__icon"></use>
                </svg>
            </a>
            `
            );
        container.append(footer);
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
                if (this.statsData.statsCorrectAnswersPercentage) {
                    widgetsData[1].value = this.statsData.statsCorrectAnswersPercentage;
                }

                if (this.statsData.statsLongestStreak) {
                    widgetsData[2].value = this.statsData.statsLongestStreak;
                }
                if (this.statsData.statsNewWords) {
                    widgetsData[0].value = this.statsData.statsNewWords;
                }
                break;
            case "Aудиовызов":
                if (this.statsData.audioCallCorrectAnswersPercentage) {
                    widgetsData[1].value = this.statsData.audioCallCorrectAnswersPercentage;
                }
                if (this.statsData.audioCallLongestStreak) {
                    widgetsData[2].value = this.statsData.audioCallLongestStreak;
                }
                if (this.statsData.audioCallNewWords) {
                    widgetsData[0].value = this.statsData.audioCallNewWords;
                }

                break;
            case "Спринт":
                if (this.statsData.sprintCorrectAnswersPercentage) {
                    widgetsData[1].value = this.statsData.sprintCorrectAnswersPercentage;
                }
                if (this.statsData.sprintLongestStreak) {
                    widgetsData[2].value = this.statsData.sprintLongestStreak;
                }
                if (this.statsData.sprintNewWords) {
                    widgetsData[0].value = this.statsData.sprintNewWords;
                }
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
            { title: 'Учебник', image: 'book.svg' },
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

            linkBlock.addEventListener('click', () => {
                const container = document.querySelector('.container__content') as HTMLDivElement;

                function clearActivLink() {
                    const links = document.querySelectorAll('.nav__item');
                    links.forEach((link) => {
                        link.classList.remove('active');
                    });
                }
                const link = document.querySelector('#book') as HTMLLIElement;
                const linkBlock = link.parentNode?.parentNode as HTMLLIElement;
                switch (item.title) {
                    case 'Аудиовызов':
                        container.innerHTML = '';
                        this.miniGames.createStartPage('Аудиовызов', 'Аудиовызов - Из 5 вариантой выберите правильный перевод озвученного слова.', 'Аудиовызов');
                        break;
                    case 'Спринт':
                        container.innerHTML = '';
                        this.miniGames.createStartPage('Спринт', 'Спринт - Выберите правильный ли перевод или нет.', 'Спринт');
                        break;
                    case 'Учебник':
                        container.innerHTML = '';
                        clearActivLink();
                        linkBlock.classList.add('active');
                        this.ebook.drawEbook();
                        break;
                    default:
                        break;
                }
            })


            linksBlock.append(linkBlock);
        })



        return linksBlock;
    }

    drawGuestUserView(): HTMLButtonElement {
        const { userPhotoBlock, userInfoBlock, statistics } = this.elements;

        userPhotoBlock.innerHTML = '';
        userInfoBlock.innerHTML = '';

        if (statistics.hasChildNodes()) {
            statistics.innerHTML = '';
        }

        statistics.append(this.createStatsBlock("Статистика", widgetsData));
        statistics.append(this.createStatsBlock("Aудиовызов", widgetsData));
        statistics.append(this.createStatsBlock("Спринт", widgetsData));

        userPhotoBlock.style.background = 'white';

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

        const logoutNavItem = document.getElementById('logout');
        if (logoutNavItem) logoutNavItem.remove();

        Object.assign(this.elements, {
            signInButton,
        })

        return signInButton;
    }

    async drawAuthUserView(userPersonalData: userPersonalData): Promise<HTMLButtonElement> {
        await this.setStatistics();
        const { userPhotoBlock, userInfoBlock, statistics } = this.elements;
        const userStatsData = [
            { text: 'Изученные слова', value: '146' },
            { text: 'Попыток', value: '2' }
        ]

        userPhotoBlock.innerHTML = '';
        userInfoBlock.innerHTML = '';
        if (statistics.hasChildNodes()) {
            statistics.innerHTML = '';
        }

        statistics.append(this.createStatsBlock("Статистика", widgetsData));
        statistics.append(this.createStatsBlock("Aудиовызов", widgetsData));
        statistics.append(this.createStatsBlock("Спринт", widgetsData));

        userPhotoBlock.style.background = 'conic-gradient(#ff8cc3, #ffbda4, #8df0ff, #ff8cc3)';

        const userPhoto = document.createElement('img') as HTMLImageElement;
        if (userPersonalData.gender === 'male') {
            userPhoto.src = './assets/img/svg/user-male.svg';
        } else {
            userPhoto.src = './assets/img/svg/user-female.svg';
        }
        userPhotoBlock.append(userPhoto);

        const logoutNavItem = document.getElementById('logout');
        if (logoutNavItem) logoutNavItem.remove();

        let logOutButton: HTMLButtonElement;

        const logOutButtonFromNav: HTMLButtonElement | null = document.querySelector('.middleBlock__logout-button');
        if (!logOutButtonFromNav) {
            const navList = document.querySelector('.nav__list') as HTMLElement;
            const navItem = document.createElement('li') as HTMLLIElement;
            navItem.classList.add('nav__item');
            navItem.id = 'logout';
      
            const middle = document.createElement('div') as HTMLDivElement;
            middle.className = 'middleBlock';
      
            const menuIcon = document.createElement('img') as HTMLImageElement;
            menuIcon.className = 'middleBlock__icon';
            menuIcon.src = `./assets/img/svg/exitIcon.svg`;
      
            const logOutButtonCreated = document.createElement('button') as HTMLButtonElement;
            logOutButtonCreated.classList.add('middleBlock__logout-button');
            logOutButtonCreated.textContent = 'Выйти';
      
            logOutButtonCreated.append(menuIcon);
            middle.append(logOutButtonCreated);
            navItem.append(middle)
            navList.append(navItem);
            logOutButton = logOutButtonCreated;
        } else logOutButton = logOutButtonFromNav;

        const userName = document.createElement('h4') as HTMLHeadingElement;
        userName.className = 'info-block__name';
        userName.textContent = userPersonalData.name;

        const userEmail = document.createElement('h4') as HTMLHeadingElement;
        userEmail.className = 'info-block__email';
        userEmail.textContent = ApiData.userEmail ? ApiData.userEmail : '-';

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
        userInfoBlock.append(userEmail);
        userInfoBlock.append(userStatsCont);

        return logOutButton;
    }

    async setStatistics() {
        const response = await this.userAccountApi.getStatistics();
        if (response.ok) {
            const statistics = await response.json();
            console.log(statistics);
            function correctAnswersCalculate(audioCall: string | undefined, sprint: string | undefined): number | null {
                if (audioCall && sprint) {
                    console.log(parseInt(audioCall), parseInt(sprint));
                    return (parseInt(audioCall) + parseInt(sprint)) / 2;
                } else if (audioCall && !sprint) {
                    return +audioCall;
                } else if (!audioCall && sprint) {
                    return +sprint;
                } else {
                    return null;
                }
            }

            function newWordsCalculate(audioCall: string | undefined, sprint: string | undefined): number {
                let audioCallNewWords, sprintNewWords;
                if (!audioCall) {
                    audioCallNewWords = 0;
                } else {
                    audioCallNewWords = +audioCall;
                }
                if (!sprint) {
                    sprintNewWords = 0;
                } else {
                    sprintNewWords = +sprint;
                }
                return audioCallNewWords + sprintNewWords;
            }

            function longSreakCalculate(audioCall: string | undefined, sprint: string | undefined): number {
                let sprintLongestStreak, audioCallLongestStreak;
                if (!audioCall) {
                    audioCallLongestStreak = 0;
                } else {
                    audioCallLongestStreak = +audioCall;
                }
                if (!sprint) {
                    sprintLongestStreak = 0;
                } else {
                    sprintLongestStreak = +sprint;
                }
                return sprintLongestStreak > audioCallLongestStreak ? sprintLongestStreak : audioCallLongestStreak;
            }

            this.statsData = {
                statsCorrectAnswersPercentage: correctAnswersCalculate(statistics.optional.audioCallCorrectAnswersPercentage, statistics.optional.sprintCorrectAnswersPercentage),

                statsNewWords: newWordsCalculate(statistics.optional.audioCallNewWords, statistics.optional.sprintNewWords),

                statsLongestStreak: longSreakCalculate(statistics.optional.audioCallLongestStreak, statistics.optional.sprintLongestStreak),

                audioCallCorrectAnswersPercentage: statistics.optional.audioCallCorrectAnswersPercentage
                    ? statistics.optional.audioCallCorrectAnswersPercentage
                    : null,

                audioCallLongestStreak: statistics.optional.audioCallLongestStreak
                    ? statistics.optional.audioCallLongestStreak
                    : null,

                audioCallNewWords: statistics.optional.audioCallNewWords
                    ? statistics.optional.audioCallNewWords
                    : null,

                sprintCorrectAnswersPercentage: statistics.optional.sprintCorrectAnswersPercentage
                    ? statistics.optional.sprintCorrectAnswersPercentage
                    : null,

                sprintLongestStreak: statistics.optional.sprintLongestStreak
                    ? statistics.optional.sprintLongestStreak
                    : null,

                sprintNewWords: statistics.optional.sprintNewWords
                    ? statistics.optional.sprintNewWords
                    : null,
            }

        } else {
            this.statsData.statsCorrectAnswersPercentage = null;
            this.statsData.statsNewWords = null;
            this.statsData.statsLongestStreak = null;
            this.statsData.audioCallCorrectAnswersPercentage = null;
            this.statsData.audioCallNewWords = null;
            this.statsData.audioCallLongestStreak = null;
            this.statsData.sprintCorrectAnswersPercentage = null;
            this.statsData.sprintNewWords = null;
            this.statsData.sprintLongestStreak = null;
            widgetsData.length = 0;
            widgetsData.push(
                {
                    name: 'Колличество новых слов сегодня',
                    unit: 'Слов',
                },
                {
                    name: 'Процент  правильных ответов сегодня',
                    unit: '%',
                },
                {
                    name: 'Самая длинная серия',
                    unit: 'Слов',
                },
            );
        }
    }
}

export default Statistics;