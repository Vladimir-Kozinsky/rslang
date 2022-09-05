import Sprint from './Sprint';
import AudioCall from './AudioCall';
import Container from '../Container/Container';
import Spinner from '../Spinner/spinner';
import BurgerMenuForNav from '../BurgerMenu/burgerMenuForNav';

class MiniGames {
  createCarts(imgName: string, title: string, description: string, gameName: string) {
    const content = document.querySelector('.container__content') as HTMLDivElement;
    let cartContainer: HTMLDivElement;

    const cart = document.createElement('div') as HTMLDivElement;
    cart.classList.add('games__cart');
    cart.dataset.gameName = gameName;

    const cartIcon = document.createElement('img') as HTMLImageElement;
    cartIcon.setAttribute('src', `../../../assets/img/png/${imgName}`);

    const cartTitle = document.createElement('h3') as HTMLHeadingElement;
    cartTitle.textContent = title;

    const cartDescription = document.createElement('p') as HTMLParagraphElement;
    cartDescription.textContent = description;
    this.createTitle();
    cart.append(cartIcon);
    cart.append(cartTitle);
    cart.append(cartDescription);

    if (document.querySelector('.games-cart__container') == null) {
      cartContainer = document.createElement('div');
      cartContainer.classList.add('games-cart__container');
      content?.append(cartContainer!);
      cartContainer.append(cart);
    } else {
      cartContainer = document.querySelector('.games-cart__container')!;
      content?.append(cartContainer!);
      cartContainer!.append(cart);
    };
  }

  createTitle() {
    const content = document.querySelector('.container__content') as HTMLDivElement;

    
    const title = document.createElement('h2');
    title.textContent = 'Мини-игры';
    title.classList.add('games__title');

    if(document.querySelectorAll('.games__title').length < 1) {
      content.append(title);
    }

  }

  goToStartPage() {
    const cartContainer = document.querySelector('.games-cart__container') as HTMLDivElement;
    cartContainer.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLDivElement;
      if (target.classList.contains('games__cart') || target.parentElement!.classList.contains('games__cart')) {
        switch (target.dataset.gameName || target.parentElement!.dataset.gameName) {
          case 'sprint':
            cartContainer.remove();
            this.createStartPage('Спринт', 'Спринт - Выберите правильный ли перевод или нет.', 'Спринт');
            break;
          case 'audioChallenge':
            cartContainer.remove();
            this.createStartPage('Аудиовызов', 'Аудиовызов - Из 5 вариантой выберите правильный перевод озвученного слова.', 'Аудиовызов');
            break;
          default:
            break;
        }
      }
    });
  }

  createStartPage(title: string, desc: string, gameName: string) {
    const content = document.querySelector('.container__content') as HTMLDivElement;
    const menuBurger = document.querySelector('.menu-burger__container') as HTMLDivElement;
    if(menuBurger) menuBurger.remove();

    const sprint = new Sprint();
    const audioCall = new AudioCall();

    const startPageContainer = document.createElement('div') as HTMLDivElement;
    startPageContainer.classList.add('start-page__container');

    const backIcon = document.createElement('div') as HTMLDivElement;
    backIcon.classList.add('return-to-prev-page');

    const startPageContent = document.createElement('div') as HTMLDivElement;
    startPageContent.classList.add('start-page__content');

    const startPageTitle = document.createElement('h2') as HTMLHeadingElement;
    startPageTitle.textContent = title;

    const description = document.createElement('p') as HTMLParagraphElement;
    description.textContent = desc;

    const startBtn = document.createElement('button') as HTMLButtonElement;
    startBtn.textContent = 'Начать';
    startBtn.dataset.gameName = gameName;

    const list = document.createElement('ul') as HTMLUListElement;
    let listElementText: string[] = [];
    if(startBtn.dataset.gameName === 'Аудиовызов') {
      listElementText = [
        'Используйте мышку или клавиатуру чтобы выбрать',
        'Используйте цыфровые клавиши от 1 до 5 чтобы выбрать ответы',
        'Используйте пробел чтобы повторить перевод',
        'Используйте Enter для перехода к следующему слову',
        'Используйте Shift если не знаете ответ',
      ];
    }
    else if(startBtn.dataset.gameName === 'Спринт') {
      listElementText = [
        'Используйте мышку или клавиатуру чтобы выбрать',
        'Используйте клавиши стрелка влево и стрелка вправо для выбора ответа',
      ];
    }

    for (let i = 0; i < listElementText.length; i += 1) {
      const listElement = document.createElement('li') as HTMLLIElement;
      listElement.textContent = listElementText[i];
      list.append(listElement);
    }

    const selectDifficulty = document.createElement('select') as HTMLSelectElement;
    for (let i = 1; i < 6; i += 1) {
      const options = document.createElement('option') as HTMLOptionElement;
      options.textContent = i.toString();
      selectDifficulty.append(options);
    }


    const spinner = new Spinner();

    startBtn.addEventListener('click', () => {
      switch (startBtn.dataset.gameName) {
        case 'Аудиовызов':
          content.innerHTML = '';
          audioCall.createPage();
          audioCall.appendDataToPage(selectDifficulty.value);
          spinner.createPage();
          break;
        case 'Спринт':
          content.innerHTML = '';
          sprint.createPage();
          sprint.appendWordsToPage(selectDifficulty.value);
          spinner.createPage();
          break;

        default:
          break;
      }
    });

    content.append(startPageContainer);
    startPageContainer.append(backIcon);
    startPageContainer.append(startPageContent);
    startPageContent.append(startPageTitle);
    startPageContent.append(description);
    startPageContent.append(list);
    startPageContent.append(selectDifficulty);
    startPageContent.append(startBtn);
    backIcon.addEventListener('click', () => {
      this.backToPage();
    })
  }

  backToPage() {
    const backIcon = document.querySelector('.return-to-prev-page') as HTMLDivElement;
    const containerBlock = document.querySelector('.container') as HTMLDivElement;
    const content = document.querySelector('.container__content') as HTMLDivElement;
    const container = new Container();
    
    content.innerHTML = '';
    const burgerMenu = new BurgerMenuForNav();
    burgerMenu.createBurgerMenu();
    this.createCarts('headphones.png', 'Аудиовызов', 'Улучшите свои навыки прослушивания с помощью игры Аудиовызов. ', 'audioChallenge');
    this.createCarts('sneaker.png', 'Спринт', 'Тренируйте навыки быстрого перевода с игрой Спринт.', 'sprint');
    if(!containerBlock.children[0].classList.contains('container__menu')) {
      containerBlock.prepend(container.createMenu());
    }
    this.goToStartPage();
  }
}

export default MiniGames;
