import ApiData from '../Api/ApiData';
import MainPageView from './MainPageView';
import AuthController from '../Auth/AuthController';
import BurgerMenuController from '../BurgerMenu/burgerMenuController';

export default class MainPageController {
  view: MainPageView;
  authController: AuthController;
  burgerMenuController: BurgerMenuController;

  constructor() {
    this.view = new MainPageView();
    this.authController = new AuthController();
    this.burgerMenuController = new BurgerMenuController();
  }

  getStartScreen(): void {
    this.view.drawStartScreen();

    const drawGuestUserView = this.view.drawGuestUserView.bind(this.view);
    const drawAuthUserView = this.view.drawAuthUserView.bind(this.view);
    this.authController.getStartScreen(drawGuestUserView, drawAuthUserView);

    const { menu, account, header, burgerMenuButton } = this.view.elements.htmlElements; 
    this.burgerMenuController.getStartScreen({menu, account}, header, burgerMenuButton);
  }
}
