import MainPageView from './MainPageView';

export default class MainPageController {
  view: MainPageView;

  constructor() {
    this.view = new MainPageView();
  }

  getStartScreen(): void {
    this.view.drawStartScreen();
  }
}
