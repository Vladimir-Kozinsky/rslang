import Container from './Container/Container';
import MainPageController from './Pages/MainPage/MainPageController';

class App {
  mainPageController: MainPageController;

  constructor() {
    this.mainPageController = new MainPageController();
  }

  startApp() {
    console.log('start app');
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
