import App from "../App";

class BurgerMenuForNav {

    createBurgerMenu() {
        const body = document.querySelector('body') as HTMLBodyElement;
            if (window.innerWidth < 1250) {
                const container = document.querySelector('.container') as HTMLDivElement;
                const burgerMenuContainer = document.createElement('div') as HTMLDivElement;
                burgerMenuContainer.classList.add('menu-burger__container');
                const burgerMenu = document.createElement('div') as HTMLDivElement;
                burgerMenu.classList.add('menu-burger');
                burgerMenu.innerHTML = `
                <input type="checkbox" name="" id="">
                <div class="hamburger-lines">
                    <span class="line line1"></span>
                    <span class="line line2"></span>
                    <span class="line line3"></span>
                </div>
                <ul class="menu-items">
                    <li><a id="#home">Личный Кабинет</a></li>
                    <li><a id="#book">Словарь</a></li>
                    <li><a id="#games">Мини-игры</a></li>
                    <li><a id="#vocabulary">Учебник</a></li>
                </ul>
            `;
                burgerMenuContainer.append(burgerMenu);
                if (document.querySelectorAll('.menu-burger__container').length < 1) {
                    container.prepend(burgerMenuContainer);
                }

                // eslint-disable-next-line no-inner-declarations
                function clearActivLink() {
                    const menuItems = document.querySelectorAll('li a');
                    menuItems.forEach((item) => {
                        item.classList.remove('menu-items__active');
                    });
                }

                // eslint-disable-next-line no-inner-declarations
                function listenMenu(e: Event) {
                    const target = e.target as HTMLLinkElement;
                    const app = new App();
                    const content = document.querySelector('.container__content') as HTMLDivElement;
                    switch (target.textContent) {
                        case 'Личный Кабинет':
                            content.innerHTML = '';
                            clearActivLink();
                            target.classList.add('menu-items__active')
                            app.drawStatistics();
                            break;
                        case 'Словарь':
                            content.innerHTML = '';
                            clearActivLink();
                            target.classList.add('menu-items__active')
                            app.vocabulary.drawVocabulary();
                            break;
                        case 'Мини-игры':
                            content.innerHTML = '';
                            clearActivLink();
                            target.classList.add('menu-items__active')
                            app.drawMiniGames();
                            break;
                        case 'Учебник':
                            content.innerHTML = '';
                            clearActivLink();
                            target.classList.add('menu-items__active')
                            app.drawEbook();
                            break;


                        default:
                            break;
                    }
                }
                document.querySelector('.menu-items')?.addEventListener('click', listenMenu);
            }
    }



}

export default BurgerMenuForNav