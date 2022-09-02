import Container from './Container/Container';
import MiniGames from './Mini-games/MiniGames';
import MainPageController from './MainPage/MainPageController';
import AuthController from './Auth/AuthController';
import ApiData from './Api/ApiData';
import Statistics from './Statistics/Statistics';

class App {
  mainPageController: MainPageController;

  authController: AuthController;
  statistics: Statistics;

  constructor() {
    ApiData.getDataFromLocalStorage();
    this.mainPageController = new MainPageController();
    this.authController = new AuthController();
    this.statistics = new Statistics(ApiData.userId);
  }

  startApp() {
    ApiData.setLocalStorageListener();
    this.authController.checkToken();
    console.log(localStorage.getItem('userId'));
    this.drowContainer();
    this.statistics.drawStatistics();
  }

  drowContainer() {
    const body = document.querySelector('body') as HTMLBodyElement;
    const container = new Container();
    body.append(container.createContainer());
  }

  switchToAnotherPage() {
    const nav = document.querySelector('.nav');
    const miniGames = new MiniGames();
    nav?.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLLinkElement;
      const content = document.querySelector('.container__content') as HTMLDivElement;
      switch (target.textContent) {
        case 'Личный кабинет':
          break;
        case 'Словарь':
          break;
        case 'Мини-игры':
          content.innerHTML = '';
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
          break;
        case 'Выход':
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
