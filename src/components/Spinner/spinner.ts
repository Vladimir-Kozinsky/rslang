export default class Spinner {
    createPage() {
        const content = document.querySelector('.container__content') as HTMLDivElement;
        const spinnerContainer = document.createElement('div') as HTMLDivElement;
        spinnerContainer.classList.add('spinner__container')
        spinnerContainer.innerHTML = `
        <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
        </svg>
        <p style='font-size:18px;padding-top:20px;'>Загрузка данных. Подождите...</p>
        `;

        content.append(spinnerContainer);
        const game = content.children[0] as HTMLDivElement;
        const optionsBtn = document.querySelectorAll('.options__button')[0] as HTMLButtonElement;
        const sprintWord = document.querySelector('.sprint-word') as HTMLHeadingElement;
        const notification = document.createElement('p') as HTMLParagraphElement;
        notification.innerHTML = 'Осталось немного...'
        let time: number = 0;

        const isGameLoaded = setInterval(() => {
            time += 0.2;
            if(time > 5) {
                spinnerContainer.append(notification)
            }
            
            if(game.classList.contains('sprint__container')) {
                if(sprintWord.innerHTML !== '') {
                    game.style.display = 'flex';
                    clearInterval(isGameLoaded);
                    spinnerContainer.remove()
                }
            }
            else if(game.classList.contains('audioCall__container')) {
                if(optionsBtn.innerHTML !== '') {
                    game.style.display = 'flex';
                    clearInterval(isGameLoaded);
                    spinnerContainer.remove()
                }
            }

        }, 200);
        console.log(game);
        game.style.display = 'none';
    }
}