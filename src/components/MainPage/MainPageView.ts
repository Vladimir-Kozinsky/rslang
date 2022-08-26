import ElementCreator from '../Utils/ElementCreator';
import { userPersonalData } from '../types';

export default class MainPageView extends ElementCreator {
  drawStartScreen(): void {
    this.drawBodyWrapper();
    this.drawHeader();
    this.drawMain();
    this.drawFooter();
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
              <a href="#team" class="menu-item__link">НАША КОМАНДА</a>
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
    // const accountUserName = this.createElement('span', account, { class: 'account__user-name' }, 'Гость');
    // const accountUserIcon = this.createElementSVG(
    //   account,
    //   { class: 'account__user-icon-wrapper' },
    //   {
    //     href: './assets/img/svg/sprite.svg#guest-user',
    //     class: 'account__user-icon',
    //   }
    // );
    // const accountAuthorizeButton = this.createElement('button', account, { class: 'account__authorize-button button' }, 'Войти');
    Object.assign(this.elements.htmlElements, {
      account,
    });
  }

  drawMain(): void {
    const { bodyInnerWrapper } = this.elements.htmlElements;

    const main = this.createElement('main', bodyInnerWrapper, { class: 'main' });
    const sectionWelcome = this.createElement('section', main, { class: 'section-welcome' });
    const sectionWelcomeDescription = this.createElement('div', sectionWelcome, { class: 'section-welcome__description' });
    const sectionWelcomeTitle = this.createElement(
      'h2',
      sectionWelcomeDescription,
      { class: 'section-title' },
      'Начни изучение английского вместе с нами '
    );
    const sectionWelcomeText = this.createElement(
      'p',
      sectionWelcomeDescription,
      { class: 'section-welcome__text' },
      `Rs-lang - это бесплатное приложение для изучения иностранного языка.
             Мы предлагаем Вам интересные и продуктивные методы для легкого освоения английского. 
             Доступно с любого устройства. Попробуйте`
    );
    const sectionWelcomeStartButton = this.createElement(
      'button',
      sectionWelcomeDescription,
      { class: 'section-welcome__start-button' },
      'Начать'
    );
    const sectionWelcomeImage = this.createElementSVG(
      sectionWelcome,
      { class: 'section-welcome__image-wrapper' },
      { href: './assets/img/svg/sprite.svg#welcome', class: 'section-welcome__image' }
    );

    const sectionAboutApp = this.createElement('section', main, { class: 'section-about-app' });
    const sectionAboutAppTitle = this.createElement(
      'h2',
      sectionAboutApp,
      { id: 'about-app', class: 'section-title' },
      '< ВОЗМОЖНОСТИ ПРИЛОЖЕНИЯ >'
    );
    const sectionAboutAppDescriptionList = this.createElement('ul', sectionAboutApp, { class: 'descriptions-list' });
    sectionAboutAppDescriptionList.insertAdjacentHTML(
      'afterbegin',
      `
            <li class="descriptions-item">
              <div class="descriptions-item__сontent-container">
                <h3 class="descriptions-item__title">Учебник</h3>
                <p class="descriptions-item__text">
                  Это коллекция, которая состоит из 3600 часто употребляемых английских слов. 
                  К каждому слову поставляется транскрипция, объяснение его смысла текстом и картинкой, пример употребления в предложении, 
                  а также звуковая запись его произношения
                </p>
              </div>
              <img src="./assets/img/svg/book.svg" class="descriptions-item__icon" alt="book">
            </li>

            <li class="descriptions-item">
              <div class="descriptions-item__сontent-container">
                <h3 class="descriptions-item__title">Словарь</h3>
                <p class="descriptions-item__text">
                  Содержит слова, изученные в процессе игры или чтения учебника. 
                  Также есть возможность добавления в него сложных слов, на которых стоит заострить внимание
                </p>
              </div>
              <img src="./assets/img/svg/pencil.svg" class="descriptions-item__icon" alt="vocabulary">
            </li>

            <li class="descriptions-item">
              <div class="descriptions-item__сontent-container">
                <h3 class="descriptions-item__title">Аудиовызов</h3>
                <p class="descriptions-item__text">
                  Это мини-игра, которая помогает улучшать восприятие речи на слух. 
                  Ее суть заключается в прослушивании слова на английском языке и выборе правильного ответа в текстовом формате
                </p>
              </div>
              <img src="./assets/img/svg/headphone.svg" class="descriptions-item__icon" alt="audio call">
            </li>

            <li class="descriptions-item">
              <div class="descriptions-item__сontent-container">
                <h3 class="descriptions-item__title">Спринт</h3>
                <p class="descriptions-item__text">
                  Это мини-игра на развитие навыка быстрого перевода. Игровой процесс следующий: 
                  В течение 60 секунд даются слова на английском языке и к ним перевод. 
                  Необходимо определить - это правильный перевод слова или нет. 
                  Чем больше правильных ответов - тем лучше
                </p>
              </div>
              <img src="./assets/img/svg/sneaker.svg" class="descriptions-item__icon" alt="sprint">
            </li>

            <li class="descriptions-item">
              <div class="descriptions-item__сontent-container">
                <h3 class="descriptions-item__title">Статистика</h3>
                <p class="descriptions-item__text">
                  Следите за своим прогрессом в освоении языка в реальном времени. 
                  Доступны результаты как и за день, так и в долгосрочной перспективе 
                </p>
              </div>
              <img src="./assets/img/svg/diagram.svg" class="descriptions-item__icon" alt="statistics">
            </li>
            `
    );
    const sectionAboutAppAdditionalInfo = this.createElement(
      'p',
      sectionAboutApp,
      { class: 'section-about-app__additional-info' },
      'Для получения всех возможностей необходимо авторизоваться'
    );

    const sectionTeam = this.createElement('section', main, { class: 'section-team' });
    const sectionTeamTitle = this.createElement('h2', sectionTeam, { id: 'team', lass: 'section-title' }, '< НАША КОМАНДА >');
    const developersList = this.createElement('ul', sectionTeam, { class: 'developers-list' });
    developersList.insertAdjacentHTML(
      'afterbegin',
      `
            <li class="developers-item">
              <div class="developers-item__image"></div>
              <h3 class="developers-item__name">Имя + фамилия</h3>
              <p class="developers-item__text">
                Вклад в проект
              </p>
            </li>

            <li class="developers-item">
              <div class="developers-item__image"></div>
              <h3 class="developers-item__name">Имя + фамилия</h3>
              <p class="developers-item__text">
                Вклад в проект
              </p>
            </li>

            <li class="developers-item">
              <div class="developers-item__image"></div>
              <h3 class="developers-item__name">Имя + фамилия</h3>
              <p class="developers-item__text">
                Вклад в проект
              </p>
            </li>
            `
    );
  }

  drawFooter(): void {
    const { bodyInnerWrapper } = this.elements.htmlElements;

    const footer = this.createElement('footer', bodyInnerWrapper, { class: 'footer' });
    const footerCopyright = this.createElement('span', footer, { class: 'footer__copyright' }, '© 2022');
    const footerDevelopersSocialList = this.createElement('ul', footer, { class: 'developers-social-list' });
    footerDevelopersSocialList.insertAdjacentHTML(
      'afterbegin',
      `
          <li class="developers-social-item">
            <a href="https://github.com/Vladimir-Kozinsky" class="developers-social-item__link">Vladimir-Kozinsky</a>
          </li>

          <li class="developers-social-item">
            <a href="https://github.com/ShahzodK" class="developers-social-item__link">ShahzodK</a>
          </li>

          <li class="developers-social-item">
            <a href="https://github.com/ScaronTr" class="developers-social-item__link">ScaronTr</a>
          </li>
          `
    );
    const footerSchoolLink = this.createElement('a', footer, { href: 'https://rs.school/js/', class: 'school-link' });
    const schoolIcon = this.createElementSVG(
      footerSchoolLink,
      { class: 'school-link__icon-wrapper' },
      { href: './assets/img/svg/sprite.svg#rss-logo', class: 'school-link__icon' }
    );
  }

  drawGuestUserView(): HTMLButtonElement {
    console.log('da');
    const { account } = this.elements.htmlElements;
    account.innerHTML = '';

    const accountUserName = this.createElement('span', account, { class: 'account__user-name' }, 'Гость');
    const accountUserIcon = this.createElementSVG(
      account,
      { class: 'account__user-icon-wrapper' },
      {
        href: './assets/img/svg/sprite.svg#guest-user',
        class: 'account__user-icon',
      }
    );
    const accountSignInButton = this.createElement(
      'button',
      account,
      { class: 'account__signin-button button' },
      'Войти'
    ) as HTMLButtonElement;
    return accountSignInButton;
  }

  drawAuthUserView(userPersonalData: userPersonalData): HTMLButtonElement {
    const { account } = this.elements.htmlElements;
    account.innerHTML = '';

    const accountUserName = this.createElement('span', account, { class: 'account__user-name' }, userPersonalData.name);
    if (userPersonalData.gender === 'male') {
      const accountUserIcon = this.createElement('div', account, { class: 'account__user-icon' });
      accountUserIcon.style.cssText = `
        background: url("../assets/img/svg/user-male.svg"),
        conic-gradient(
          from 180deg at 50% 50%,
          #ffbda4 -0.12deg,
          #8df0ff 133.98deg,
          #ff8cc3 232.5deg,
          #ffbda4 359.88deg,
          #8df0ff 493.98deg
        );
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      `;
    } else if (userPersonalData.gender === 'female') {
      const accountUserIcon = this.createElement('div', account, { class: 'account__user-icon' });
      accountUserIcon.style.cssText = `
        background: url("../assets/img/svg/user-female.svg"),
        conic-gradient(
          from 180deg at 50% 50%,
          #ffbda4 -0.12deg,
          #8df0ff 133.98deg,
          #ff8cc3 232.5deg,
          #ffbda4 359.88deg,
          #8df0ff 493.98deg
        );
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      `;
    } else {
      console.log('da');
      const accountUserIcon = this.createElementSVG(
        account,
        { class: 'account__user-icon-wrapper' },
        {
          href: './assets/img/svg/sprite.svg#guest-user',
          class: 'account__user-icon',
        }
      );
    }
    const accountLogoutButton = this.createElement(
      'button',
      account,
      { class: 'account__logout-button button' },
      'Выйти'
    ) as HTMLButtonElement;
    return accountLogoutButton;
  }
}
