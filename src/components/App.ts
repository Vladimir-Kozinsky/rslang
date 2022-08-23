import Container from './Container/Container';
import MiniGames from './Mini-games/MiniGames';
import Sprint from './Mini-games/Sprint';

class App {
  startApp() {
    console.log('start app');
    this.drowContainer();
  }

  drowContainer() {
    const body = document.querySelector('body') as HTMLBodyElement;
    const container = new Container();
    body.append(container.createContainer());
  }

  switchToAnotherPage() {
    const nav = document.querySelector('.nav');
    const miniGames = new MiniGames();
    nav?.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLLinkElement;
      const content = document.querySelector(
        '.container__content'
      ) as HTMLDivElement;
      switch (target.textContent) {
        case 'Личный кабинет':
          
          break;
        case 'Словарь':
          
          break;
        case 'Мини-игры':
          content.innerHTML = '';
          miniGames.createCarts(
            'headphones.png',
            'Аудиовызов',
            'Улучшите свои навыки прослушивания с помощью игры Аудиовызов. ',
            'audioChallenge'
          );
          miniGames.createCarts(
            'sneaker.png',
            'Спринт',
            'Тренируйте навыки быстрого перевода с игрой Спринт.',
            'sprint'
          );
          miniGames.goToStartPage();
          break;
        case 'Учебник':
          
          break;
        case 'Выход':
        
          break;
      
        default:
          break;
      }
    })
  }
}

export default App;
