import Container from "./Container/Container";

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
}

export default App;