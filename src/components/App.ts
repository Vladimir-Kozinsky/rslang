import Container from './Container/Container';
import MiniGames from './Mini-games/MiniGames';
import MainPageController from './MainPage/MainPageController';
import AuthController from './Auth/AuthController';
import ApiData from './Api/ApiData';
import Vocabulary from './Vocabulary/Vocabulary';
import Ebook from './Ebook/Ebook';
import Statistics from './Statistics/Statistics';
import BurgerMenuForNav from './BurgerMenu/burgerMenuForNav';

class App {
  mainPageController: MainPageController;
  authController: AuthController;
  vocabulary: Vocabulary;
  ebook: Ebook;
  miniGames: MiniGames;
  statistics: Statistics;

  constructor() {
    ApiData.getDataFromLocalStorage();
    this.mainPageController = new MainPageController();
    this.authController = new AuthController();
    this.vocabulary = new Vocabulary();
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
    const burgerMenu = new BurgerMenuForNav();
    burgerMenu.createBurgerMenu();
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
      const body = document.body;
      const target = e.target as HTMLLinkElement;
      const link = target.parentNode?.parentNode as HTMLLIElement;
      if (target.tagName !== 'A' || link.classList.contains('active')) return
      const content = document.querySelector('.container__content') as HTMLDivElement;
      switch (target.textContent) {
        case 'Главная страница':
          body.innerHTML = '';
          this.drawMainPage();
          break;
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
          this.vocabulary.drawVocabulary();
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
        default:
          break;
      }
    });
  }

  setMainPageMenuSwitcher(): void {
    const { menuList, sectionWelcomeStartButton } = this.mainPageController.view.elements.htmlElements;
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
            this.vocabulary.drawVocabulary();
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
