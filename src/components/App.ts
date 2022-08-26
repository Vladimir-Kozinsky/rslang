import Container from './Container/Container';
import MainPageController from './MainPage/MainPageController';
import AuthorizationController from './Authorization/AuthorizationController';
import ApiData from './Api/ApiData';

class App {
  mainPageController: MainPageController;
  authorizationController: AuthorizationController;

  constructor() {
    ApiData.getDataFromLocalStorage();
    this.mainPageController = new MainPageController();
    this.authorizationController = new AuthorizationController();
  }

  startApp() {
    ApiData.setLocalStorageListener();
    console.log('start app');
    this.authorizationController.checkToken();
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
