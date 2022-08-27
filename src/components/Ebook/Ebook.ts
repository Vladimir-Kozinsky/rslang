/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
class Ebook {
    drawEbook() {
        const container = document.querySelector('.container__content') as HTMLDivElement;
        const ebook = document.createElement('div') as HTMLDivElement;
        ebook.className = 'ebook';

        ebook.append(this.drawHeader());
        container.append(ebook);
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