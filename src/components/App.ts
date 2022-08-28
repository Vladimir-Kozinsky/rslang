import Container from './Container/Container';
import MainPageController from './MainPage/MainPageController';
import AuthController from './Auth/AuthController';
import ApiData from './Api/ApiData';

class App {
  mainPageController: MainPageController;
  authController: AuthController;

  constructor() {
    ApiData.getDataFromLocalStorage();
    this.mainPageController = new MainPageController();
    this.authController = new AuthController();
  }

  startApp() {
    ApiData.setLocalStorageListener();
    console.log('start app');
    this.authController.checkToken();
    this.drawMainPage();
  }

  drowContainer() {
    const body = document.querySelector('body') as HTMLBodyElement;

    const container = new Container();

    body.append(container.createContainer());
  }

  drawMainPage(): void {
    this.mainPageController.getStartScreen();
  }
}

export default App;
