import ElementCreator from '../../Utils/ElementCreator';

export default class MainPageView extends ElementCreator {
  drawStartScreen(): void {
    this.drawBodyWrapper();
    this.drawHeader();
  }

  drawBodyWrapper(): void {
    const bodyInnerWrapper = this.createElement('div', this.body, {
      class: 'body__inner-wrapper',
    });
    Object.assign(this.elements.htmlElements, {
      bodyInnerWrapper,
    });
  }

  drawHeader(): void {
    const { bodyInnerWrapper } = this.elements.htmlElements;

    const header = this.createElement('header', bodyInnerWrapper, {
      class: 'header',
    });
    const logo = this.createElement('div', header, { class: 'logo' });
    const logoIcon = this.createElementSVG(
      logo,
      { class: 'logo__icon-wrapper' },
      { class: 'logo__icon', href: './assets/img/svg/sprite.svg#logo' }
    );
    const logoTitle = this.createElement('h1', logo, { class: 'logo__title' }, 'Rs-lang');
    const menu = this.createElement('nav', header, { class: 'menu' });
    const menuList = this.createElement('ul', menu, { class: 'menu-list' });
    menuList.insertAdjacentHTML(
      'afterbegin',
      `
            <li class="menu-item">
              <a href="#about-app" class="menu-item__link">О ПРИЛОЖЕНИИ</a>
            </li>
            <li class="menu-item">
              <a href="#about-team" class="menu-item__link">НАША КОМАНДА</a>
            </li>
            <li class="menu-item">
              <a href="" class="menu-item__link" data-page="book">УЧЕБНИК</a>
            </li>
            <li class="menu-item">
              <a href="" class="menu-item__link" data-page="vocabulary">СЛОВАРЬ</a>
            </li>
            <li class="menu-item">
              <a href="" class="menu-item__link" data-page="games">ИГРЫ</a>
            </li>
            <li class="menu-item">
              <a href="" class="menu-item__link" data-page="statistics">СТАТИСТИКА</a>
            </li>
          `
    );
    const account = this.createElement('div', header, { class: 'account' });
    const accountUserName = this.createElement('span', account, { class: 'account__user-name' }, 'Гость');
    const accountUserIcon = this.createElementSVG(
      account,
      { class: 'account__user-icon-wrapper' },
      {
        href: './assets/img/svg/sprite.svg#guest-user',
        class: 'account__user-icon',
      }
    );
    const accountAuthorizeButton = this.createElement('button', account, { class: 'account__authorize-button button' }, 'Войти');
  }
}
