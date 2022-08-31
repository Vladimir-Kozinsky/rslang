import { IObj } from "../types";
import ElementCreator from "../Utils/ElementCreator";

export default class BurgerMenuView extends ElementCreator {
  drawBurgerMenuContainer(): void {
    const body = document.body;

    const blackout = this.createElement('div', body, { class: 'burger-menu-blackout burger-fade' });
    const burgerMenu = this.createElement('div', blackout, { class: 'burger-menu burger-slide-out' });
    const burgerMenuInnerWrapper = this.createElement('div', burgerMenu, { class: 'burger-menu__inner-wrapper' });
    const closeButton =  this.createElement('button', burgerMenuInnerWrapper, { class: 'burger-menu-close-button' });
    Object.assign(this.elements.htmlElements, {
      blackout,
      burgerMenu,
      burgerMenuInnerWrapper,
      closeButton,
    })
  }

  drawBurgerMenu(burgerMenuElements: IObj<HTMLElement>): void {
    const { burgerMenuInnerWrapper, closeButton } = this.elements.htmlElements;
    burgerMenuInnerWrapper.append(burgerMenuElements.account, burgerMenuElements.menu);
  }

  deleteBurgerMenu(): void {
    const { blackout } = this.elements.htmlElements;
    blackout.remove();
  }
}