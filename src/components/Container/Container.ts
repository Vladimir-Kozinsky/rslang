import ApiData from "../Api/ApiData";

class Container {
  createContainer() {
    const container = document.createElement('main') as HTMLElement;
    container.className = 'container';

    const content = document.createElement('div') as HTMLDivElement;
    content.className = 'container__content';

    container.append(this.createMenu());
    container.append(content);

    return container;
  }

  createMenu() {
    const menu = document.createElement('aside') as HTMLElement;
    menu.className = 'container__menu';

    const logo = document.createElement('div') as HTMLDivElement;
    logo.className = 'logo';

    const logoImg = document.createElement('img') as HTMLImageElement;
    logoImg.className = 'logo__img';
    logoImg.src = '../../assets/img/png/logo.png';

    const logoTitle = document.createElement('h4') as HTMLHeadingElement;
    logoTitle.className = 'logo__title';

    logo.append(logoImg);
    logo.append(logoTitle);
    menu.append(logo);

    menu.append(this.createNav());
    return menu;
  }

  createNav() {
    const menuItems = [
      { id: 'main-page', text: 'Главная страница', icon: 'arrow-back.svg' },
      { id: 'home', text: 'Личный кабинет', icon: 'homeIcon.svg' },
      { id: 'vocabulary', text: 'Словарь', icon: 'vacIcon.svg' },
      { id: 'games', text: 'Мини-игры', icon: 'gamesIcon.svg' },
      { id: 'book', text: 'Учебник', icon: 'bookIcon.svg' },
    ];

    const nav = document.createElement('nav') as HTMLElement;
    nav.className = 'nav';

    const ul = document.createElement('ul') as HTMLUListElement;
    ul.classList.add('nav__list');
    menuItems.forEach((item) => {
      const menuItem = document.createElement('li') as HTMLLIElement;
      menuItem.className = 'nav__item';
      if (item.text !== 'Словарь') {
        menuItem.className = 'nav__item';
      } else {
        menuItem.className = 'nav__item active';
      }

      const before = document.createElement('div') as HTMLDivElement;
      before.className = 'beforeBlock';

      const beforeBg = document.createElement('div') as HTMLDivElement;
      beforeBg.className = 'beforeBlockBg';
      beforeBg.append(before);

      const link = document.createElement('a') as HTMLElement;
      link.className = 'middleBlock__link';
      link.textContent = item.text;
      link.id = item.id;

      const menuIcon = document.createElement('img') as HTMLImageElement;
      menuIcon.className = 'middleBlock__icon';
      menuIcon.src = `../../assets/img/svg/${item.icon}`;

      const middle = document.createElement('div') as HTMLDivElement;
      middle.className = 'middleBlock';

      link.append(menuIcon);
      middle.append(link);

      const after = document.createElement('div') as HTMLDivElement;
      after.className = 'afterBlock';

      const afterBg = document.createElement('div') as HTMLDivElement;
      afterBg.className = 'afterBlockBg';
      afterBg.append(after);

      menuItem.append(beforeBg);
      menuItem.append(middle);
      menuItem.append(afterBg);
      ul.append(menuItem);
    });

    if (ApiData.userIsAuth) {
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

      logOutButton.onclick = () => {
        ApiData.clear();
        navItem.remove();
      };

      logOutButton.append(menuIcon);
      middle.append(logOutButton);
      navItem.append(middle)
      ul.append(navItem);
    }

    nav.append(ul);
    return nav;
  }
}

export default Container;
