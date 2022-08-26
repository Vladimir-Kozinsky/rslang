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
        const headerMenu = document.createElement('div') as HTMLDivElement;
        headerMenu.className = 'header-menu';
        return headerMenu;
    }
}

export default Ebook;