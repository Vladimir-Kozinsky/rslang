class Container {
  createContainer() {
    const container = document.createElement('main') as HTMLDivElement;
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
    menu.append(this.crateNav());
    return menu;
  }

  crateNav() {
    const menuItems = [
      'Личный кабинет',
      'Словарь',
      'Учебник',
      'Настройки',
      'Выход',
    ];
    const nav = document.createElement('nav') as HTMLElement;
    nav.className = 'nav';

    const ul = document.createElement('ul') as HTMLUListElement;
    menuItems.forEach((item) => {
      const menuItem = document.createElement('li') as HTMLLIElement;
      menuItem.className = 'nav__item';
      const link = document.createElement('a') as HTMLElement;
      link.textContent = item;
      menuItem.append(link);
      ul.append(menuItem);
    });

    nav.append(ul);
    return nav;
  }
}

export default Container;
