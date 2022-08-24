import StatsWidget from "./StatsWidget/StatsWidget";

interface ISatsData {
    name: string;
    unit: string;
    value: number;
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
        value: 21
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
        const userBlock = document.createElement('div') as HTMLDivElement;
        userBlock.className = 'user-block';

        return userBlock;
    }

    createLinksBlock() {
        const linksBlock = document.createElement('div') as HTMLDivElement;
        linksBlock.className = 'links-block';
        

        
        return linksBlock; 
    }


}

export default Statistics;