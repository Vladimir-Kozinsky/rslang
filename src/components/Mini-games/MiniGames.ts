import Sprint from './Sprint';

class MiniGames {
  createCarts(
    imgName: string,
    title: string,
    description: string,
    gameName: string
  ) {
    const content = document.querySelector(
      '.container__content'
    ) as HTMLDivElement;
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
    }
  }

  createTitle() {
    const content = document.querySelector(
      '.container__content'
    ) as HTMLDivElement;

    const title = document.createElement('h2');
    title.textContent = 'Мини-игры';

    content.append(title);
  }

  goToStartPage() {
    const cartContainer = document.querySelector(
      '.games-cart__container'
    ) as HTMLDivElement;
    cartContainer.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLDivElement;
      if (
        target.classList.contains('games__cart') ||
        target.parentElement!.classList.contains('games__cart')
      ) {
        switch (
          target.dataset.gameName ||
          target.parentElement!.dataset.gameName
        ) {
          case 'sprint':
            cartContainer.remove();
            this.createStartPage(
              'Спринт',
              'Спринт - Выберите правильный ли перевод или нет.',
              'Спринт'
            );
            break;
          case 'audioChallenge':
            cartContainer.remove();
            this.createStartPage(
              'Аудиовызов',
              'Аудиовызов - Из 5 вариантой выберите правильный перевод озвученного слова.',
              'Аудиовызов'
            );
            break;
          default:
            break;
        }
      }
    });
  }

  createStartPage(title: string, desc: string, gameName: string) {
    const content = document.querySelector(
      '.container__content'
    ) as HTMLDivElement;

    const sprint = new Sprint();

    const startPageContainer = document.createElement('div') as HTMLDivElement;
    startPageContainer.classList.add('start-page__container');

    const backIcon = document.createElement('button') as HTMLButtonElement;
    backIcon.classList.add('back__button');

    const startPageContent = document.createElement('div') as HTMLDivElement;
    startPageContent.classList.add('start-page__content');

    const startPageTitle = document.createElement('h2') as HTMLHeadingElement;
    startPageTitle.textContent = title;

    const description = document.createElement('p') as HTMLParagraphElement;
    description.textContent = desc;

    const list = document.createElement('ul') as HTMLUListElement;
    const listElementText: string[] = [
      'Используйте мышку или клавиатуру чтобы выбрать',
      'Используйте цыфровые клавиши от 1 до 5 чтобы выбрать ответы',
      'Используйте пробел чтобы повторить перевод',
      'Используйте Enter для перехода к следующему слову',
      'Используйте Shift если не знаете ответ',
    ];
    for (let i = 0; i < 5; i += 1) {
      const listElement = document.createElement('li') as HTMLLIElement;
      listElement.textContent = listElementText[i];
      list.append(listElement);
    }

    const selectDifficulty = document.createElement(
      'select'
    ) as HTMLSelectElement;
    for (let i = 1; i < 6; i += 1) {
      const options = document.createElement('option') as HTMLOptionElement;
      options.textContent = i.toString();
      selectDifficulty.append(options);
    }

    const startBtn = document.createElement('button') as HTMLButtonElement;
    startBtn.textContent = 'Начать';
    startBtn.dataset.gameName = gameName;

    startBtn.addEventListener('click', () => {
      switch (startBtn.dataset.gameName) {
        case 'Аудиовызов':
          break;
        case 'Спринт':
          content.innerHTML = '';
          sprint.createPage();
          sprint.appendWordsToPage(selectDifficulty.value);
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
    this.backToPage();
  }

  backToPage() {
    const backIcon = document.querySelector(
      '.back__button'
    ) as HTMLButtonElement;
    const startPage = document.querySelector(
      '.start-page__container'
    ) as HTMLDivElement;
    backIcon.addEventListener('click', () => {
      startPage!.remove();
      this.createCarts(
        'headphones.png',
        'Аудиовызов',
        'Улучшите свои навыки прослушивания с помощью игры Аудиовызов. ',
        'audioChallenge'
      );
      this.createCarts(
        'sneaker.png',
        'Спринт',
        'Тренируйте навыки быстрого перевода с игрой Спринт.',
        'sprint'
      );
      this.goToStartPage();
    });
  }
}

export default MiniGames;
