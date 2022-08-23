import UserAccountApi from "../Api/UserAccountApi";
import { IAuthorizationData } from "../types";
import AuthorizationView from "./AuthorizationView";

export default class AuthorizationController {
  view: AuthorizationView;
  api: UserAccountApi;

  constructor() {
    this.view = new AuthorizationView();
    this.api = new UserAccountApi('http://localhost:3000');
  }

  getStartScreen(signInButton: HTMLButtonElement) {
    this.view.drawAuthContainer();
  }
}