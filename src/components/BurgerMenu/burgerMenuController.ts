import { IObj } from "../types";
import BurgerMenuView from "./burgerMenuView";

export default class BurgerMenuController {
  view: BurgerMenuView;
  burgerMenuActive: boolean;

  constructor() {
    this.view = new BurgerMenuView();
    this.burgerMenuActive = false;
  }

  getStartScreen(burgerMenuElements: IObj<HTMLElement>, header: HTMLElement, openButton: HTMLElement): void {
    if (document.body.clientWidth < 1180) {
      this.burgerMenuActive = true;
      this.view.drawBurgerMenuContainer();
      this.view.drawBurgerMenu(burgerMenuElements);
      this.setOpenMenuListener(openButton);
      this.setCloseMenuListeners();
    }
    this.setResizeListener(burgerMenuElements, header, openButton);
  }

  setResizeListener(burgerMenuElements: IObj<HTMLElement>, header: HTMLElement, openButton: HTMLElement): void {
    const body = document.body;
    body.onresize = () => {
      if (body.clientWidth < 1180) {
        if (!this.burgerMenuActive) {
          if (!this.view.elements.htmlElements.blackout) {
            this.view.drawBurgerMenuContainer();
            this.setOpenMenuListener(openButton);
            this.setCloseMenuListeners();
          }
          this.burgerMenuActive = true;
          this.view.drawBurgerMenu(burgerMenuElements);
        }
      } else {
        if (this.burgerMenuActive) {
          this.burgerMenuActive = false;
          header.append(burgerMenuElements.menu, burgerMenuElements.account);
        }
      }
    } 
  }

  setOpenMenuListener(openButton: HTMLElement): void {
    const body = document.body;
    const { blackout, burgerMenu } = this.view.elements.htmlElements;

    openButton.onclick = () => {
      body.classList.add('body-scroll-block');  
      blackout.classList.remove('burger-fade');
      burgerMenu.classList.remove('burger-slide-out');
      blackout.classList.add('burger-fill');
      burgerMenu.classList.add('burger-slide-in');
    }
  }

  setCloseMenuListeners(): void {
    const body = document.body;
    const { closeButton, blackout, burgerMenu } = this.view.elements.htmlElements;

    blackout.onclick = (event) => {
      const target = event.target as HTMLElement;
      if (target === blackout || target === closeButton || target.classList.contains('menu-item__link')) {
        blackout.classList.remove('burger-fill');
        burgerMenu.classList.remove('burger-slide-in');
        blackout.classList.add('burger-fade');
        burgerMenu.classList.add('burger-slide-out');
        body.classList.remove('body-scroll-block');
      }
    }
  }
}