/* eslint-disable class-methods-use-this */
import StatsWidget from "./StatsWidget/StatsWidget";
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
    userId: string;

    statsData: IStatsData;
    userAccountApi: UserAccountApi;
    miniGames: MiniGames;
    ebook: Ebook;

    constructor(userId: string) {
        this.ebook = new Ebook();
        this.miniGames = new MiniGames();
        this.userAccountApi = new UserAccountApi();
        this.userId = userId;
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

        statistics.append(this.createStatsBlock("Статистика", widgetsData));
        statistics.append(this.createStatsBlock("Aудиовызов", widgetsData));
        statistics.append(this.createStatsBlock("Спринт", widgetsData,));

        statsWrap.append(statistics);
        statsWrap.append(this.createUserBlock());
        statsWrap.append(this.createLinksBlock());

        container.append(statsWrap);
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
                    widgetsData[0].value = this.statsData.statsCorrectAnswersPercentage;
                }

                if (this.statsData.statsLongestStreak) {
                    widgetsData[1].value = this.statsData.statsLongestStreak;
                }
                if (this.statsData.statsNewWords) {
                    widgetsData[2].value = this.statsData.statsNewWords;
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

        const userStatsData = [
            { text: 'Изученные слова', value: '146' },
            { text: 'Попыток', value: '2' }
        ]

        const userBlock = document.createElement('div') as HTMLDivElement;
        userBlock.className = 'user-block';


        const userPhotoBlock = document.createElement('div') as HTMLDivElement;
        userPhotoBlock.className = 'user-block__photo';
        if (!ApiData.userGender) {
            userPhotoBlock.style.background = 'white';
        }

        const userPhoto = document.createElement('img') as HTMLImageElement;
        userPhoto.src = ApiData.userGender ? ApiData.userGender === 'male' ? userMale : userFemale : '';
        userPhotoBlock.append(userPhoto);

        const userInfoBlock = document.createElement('div') as HTMLDivElement;
        userInfoBlock.className = 'user-block__info'

        if (ApiData.userId) {
            const userName = document.createElement('h4') as HTMLHeadingElement;
            userName.className = 'info-block__name';
            userName.textContent = ApiData.userName ? ApiData.userName : '-';
            userInfoBlock.append(userName);

            const userEmail = document.createElement('h4') as HTMLHeadingElement;
            userEmail.className = 'info-block__email';
            userEmail.textContent = ApiData.userEmail ? ApiData.userEmail : '-';
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
                userStatsValue.textContent = ApiData.userId ? item.value : '-';
                userStats.append(userStatsValue);
                userStatsCont.append(userStats);
                userInfoBlock.append(userStatsCont);

            })
        } else {
            userInfoBlock.classList.add('disabled');
            const muteBlock = document.createElement('div') as HTMLDivElement;
            muteBlock.className = 'user-block__mute-block';
            userInfoBlock.append(muteBlock);
            const muteBlockImg = document.createElement('img') as HTMLImageElement;
            muteBlockImg.src = '../../../assets/img/svg/lock.svg';
            muteBlock.append(muteBlockImg);
        }




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

    async setStatistics() {
        const response = await this.userAccountApi.getStatistics();
        if (response.ok) {
            const statistics = await response.json();
            this.statsData = {
                statsCorrectAnswersPercentage: statistics.optional.statsCorrectAnswersPercentage ? statistics.optional.statsCorrectAnswersPercentage : null,
                statsNewWords: statistics.optional.statsNewWords ? statistics.optional.statsNewWords : null,
                statsLongestStreak: statistics.optional.statsLongestStreak ? statistics.optional.statsLongestStreak : null,
                audioCallCorrectAnswersPercentage: statistics.optional.audioCallCorrectAnswersPercentage ? statistics.optional.audioCallCorrectAnswersPercentage : null,
                audioCallLongestStreak: statistics.optional.audioCallLongestStreak ? statistics.optional.audioCallLongestStreak : null,
                audioCallNewWords: statistics.optional.audioCallNewWords ? statistics.optional.audioCallNewWords : null,
                sprintCorrectAnswersPercentage: statistics.optional.sprintCorrectAnswersPercentage ? statistics.optional.sprintCorrectAnswersPercentage : null,
                sprintLongestStreak: statistics.optional.sprintLongestStreak ? statistics.optional.sprintLongestStreak : null,
                sprintNewWords: statistics.optional.sprintNewWords ? statistics.optional.sprintNewWords : null,
            }
        }
    }
}

export default Statistics;