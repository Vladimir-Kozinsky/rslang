import Container from './Container/Container';
import MiniGames from './Mini-games/MiniGames';
import MainPageController from './MainPage/MainPageController';
import AuthController from './Auth/AuthController';
import ApiData from './Api/ApiData';
import Ebook from './Ebook/Ebook';

class App {
  mainPageController: MainPageController;

  authController: AuthController;
  ebook: Ebook;

  constructor() {
    ApiData.getDataFromLocalStorage();
    this.mainPageController = new MainPageController();
    this.authController = new AuthController();
    this.ebook = new Ebook();
  }

  startApp() {
    ApiData.setLocalStorageListener();
    this.authController.checkToken();

    this.drawMainPage();
    //this.drowContainer();
    console.log(localStorage.getItem('userId'));
  }

  drowContainer() {
    const body = document.querySelector('body') as HTMLBodyElement;
    const container = new Container();
    body.append(container.createContainer());
  }

  switchToAnotherPage() {
    const nav = document.querySelector('.nav');
    const miniGames = new MiniGames();

    function clearActivLink() {
      const links = document.querySelectorAll('.nav__item');
      links.forEach((link) => {
        link.classList.remove('active');
      });
    }

    nav?.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLLinkElement;
      const link = target.parentNode?.parentNode as HTMLLIElement;
      const content = document.querySelector('.container__content') as HTMLDivElement;
      switch (target.textContent) {
        case 'Личный кабинет':
          content.innerHTML = '';
          clearActivLink();
          link.classList.add('active');
          break;
        case 'Словарь':
          content.innerHTML = '';
          clearActivLink();
          link.classList.add('active');
          break;
        case 'Мини-игры':
          content.innerHTML = '';
          clearActivLink();
          link.classList.add('active');
          miniGames.createCarts(
            'headphones.png',
            'Аудиовызов',
            'Улучшите свои навыки прослушивания с помощью игры Аудиовызов. ',
            'audioChallenge'
          );
          miniGames.createCarts('sneaker.png', 'Спринт', 'Тренируйте навыки быстрого перевода с игрой Спринт.', 'sprint');
          miniGames.goToStartPage();
          break;
        case 'Учебник':
          content.innerHTML = '';
          clearActivLink();
          link.classList.add('active');
          this.ebook.drawEbook();
          break;
        case 'Настройки':
          content.innerHTML = '';
          clearActivLink();
          link.classList.add('active');
          break;
        case 'Выход':
          content.innerHTML = '';
          break;

        default:
          break;
      }
    });
  }

  drawMainPage(): void {
    this.mainPageController.getStartScreen();
  }
}

export default App;
