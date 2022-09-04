import ApiData from "../../Api/ApiData";
import Statistics from "../Statistics";

class StatsWidget {
    createWidget(header: string, unit: string, value?: number) {
        const widget = document.createElement('div') as HTMLDivElement;
        widget.className = 'widget';

        const widgetHeader = document.createElement('h4') as HTMLHeadElement;
        widgetHeader.className = 'widget__header';
        widgetHeader.textContent = header;

        const widgetData = document.createElement('div') as HTMLDivElement;
        widgetData.className = 'widget-data';

        const widgetDataUnit = document.createElement('span') as HTMLSpanElement;
        widgetDataUnit.className = 'widget-data__unit';
        widgetDataUnit.textContent = unit;

        const widgetDataValue = document.createElement('span') as HTMLSpanElement;
        widgetDataValue.className = 'widget-data__value'

        if (ApiData.userId) {
            if (value) {
                widgetDataValue.textContent = value.toString();
            } else {
                widgetDataValue.textContent = '-';
            }
        } else {
            widgetDataValue.textContent = '';
            widget.classList.add('disabled');
            const muteBlock = document.createElement('div') as HTMLDivElement;
            muteBlock.className = 'mute-block';
            widget.append(muteBlock);
            const muteBlockImg = document.createElement('img') as HTMLImageElement;
            muteBlockImg.src = '../../../assets/img/svg/lock.svg';
            muteBlock.append(muteBlockImg);
        }

        widgetData.append(widgetDataUnit);
        widgetData.append(widgetDataValue);
        widget.append(widgetHeader);
        widget.append(widgetData);
        return widget;
    }
}

export default StatsWidget;