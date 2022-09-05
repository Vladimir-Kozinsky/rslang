import Container from './Container/Container';
import MiniGames from './Mini-games/MiniGames';
import MainPageController from './MainPage/MainPageController';
import AuthController from './Auth/AuthController';
import ApiData from './Api/ApiData';
import Ebook from './Ebook/Ebook';
import Statistics from './Statistics/Statistics';

class App {
  mainPageController: MainPageController;

  authController: AuthController;
  ebook: Ebook;
  miniGames: MiniGames;
  statistics: Statistics;

  constructor() {
    ApiData.getDataFromLocalStorage();
    this.mainPageController = new MainPageController();
    this.authController = new AuthController();
    this.ebook = new Ebook();
    this.miniGames = new MiniGames();
    this.statistics = new Statistics(ApiData.userId);
  }

  async startApp() {
    ApiData.setLocalStorageListener();
    this.authController.checkToken();

    await this.drawMainPage();
    console.log(localStorage.getItem('userId'));
  }

  drowContainer() {
    const body = document.querySelector('body') as HTMLBodyElement;
    const container = new Container();
    body.append(container.createContainer());
  }

  switchToAnotherPage() {
    const nav = document.querySelector('.nav');

    function clearActivLink() {
      const links = document.querySelectorAll('.nav__item');
      links.forEach((link) => {
        link.classList.remove('active');
      });
    }

    nav?.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLLinkElement;
      if (target.tagName !== 'A') return
      const link = target.parentNode?.parentNode as HTMLLIElement;
      const content = document.querySelector('.container__content') as HTMLDivElement;
      switch (target.textContent) {
        case 'Личный кабинет':
          content.innerHTML = '';
          clearActivLink();
          link.classList.add('active');
          this.drawStatistics();
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
          this.drawMiniGames();
          break;
        case 'Учебник':
          content.innerHTML = '';
          clearActivLink();
          link.classList.add('active');
          this.drawEbook();
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

  setMainPageMenuSwitcher(): void {
    const { menuList, sectionWelcomeStartButton} = this.mainPageController.view.elements.htmlElements;
    const { book, vocabulary, games, statistics } = this.mainPageController.view.pageLinks;
    
    menuList.onclick = (event) => {
      const target = event.target;

      if (target) {
        if (target === book || target === vocabulary || target === games || target === statistics) {
          event.preventDefault();
          document.body.innerHTML = '';
          this.drowContainer();
          this.switchToAnotherPage();

          if (target === book) {
            this.drawEbook();
          } else if (target === vocabulary) {
            // to do
          } else if (target === games) {
            this.drawMiniGames();
          } else if (target === statistics) {
            this.drawStatistics();
          }
        }
      }
    }

    sectionWelcomeStartButton.onclick = () => {
      document.body.innerHTML = '';
      this.drowContainer();
      this.drawStatistics();
      this.switchToAnotherPage();
    }
  }

  async drawMainPage(): Promise<void> {
    await this.mainPageController.getStartScreen();
    this.setMainPageMenuSwitcher();
  }

  drawMiniGames(): void {
    this.miniGames.createCarts(
      'headphones.png',
      'Аудиовызов',
      'Улучшите свои навыки прослушивания с помощью игры Аудиовызов. ',
      'audioChallenge'
    );
    this.miniGames.createCarts('sneaker.png', 'Спринт', 'Тренируйте навыки быстрого перевода с игрой Спринт.', 'sprint');
    this.miniGames.goToStartPage();
  }

  drawEbook(): void {
    this.ebook.drawEbook();
  }

  drawStatistics(): void {
    this.statistics.drawStatistics();
  }
}

export default App;
