import ApiData from '../Api/ApiData';
import MainPageView from './MainPageView';
import AuthController from '../Auth/AuthController';

export default class MainPageController {
  view: MainPageView;
  authController: AuthController;

  constructor() {
    this.view = new MainPageView();
    this.authController = new AuthController();
  }

  getStartScreen(): void {
    this.view.drawStartScreen();
    this.authController.view.drawAuthContainer();
    const drawGuestUserView = this.view.drawGuestUserView.bind(this.view);
    const drawAuthUserView = this.view.drawAuthUserView.bind(this.view);
    this.authController.getStartScreen(drawGuestUserView, drawAuthUserView);
  }

  getGuestUserView(): void {
    this.view.drawGuestUserView();
  }

  getAuthUserView(): void {
    const userPersonalData = {
      name: ApiData.userName,
      gender: ApiData.userGender,
    };
    this.view.drawAuthUserView(userPersonalData);
  }
}
