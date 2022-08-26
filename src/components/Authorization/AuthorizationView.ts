import ElementCreator from '../Utils/ElementCreator';

export default class AuthorizationView extends ElementCreator {
  drawAuthContainer(): void {
    const body = document.body;

    const blackout = this.createElement('div', body, { class: 'auth-blackout fade' });
    const authWrapper = this.createElement('div', blackout, { class: 'auth-wrapper' });
    const auth = this.createElement('div', authWrapper, { class: 'auth' });
    Object.assign(this.elements.htmlElements, {
      blackout,
      auth,
    });
  }

  drawSignIn(): void {
    const { auth } = this.elements.htmlElements;
    auth.innerHTML = '';
    const cancelButton = this.createElement('button', auth, { class: 'auth__cancel-button' });
    const authIcon = this.createElementSVG(
      auth,
      { class: 'auth__icon-wrapper' },
      { href: './assets/img/svg/sprite.svg#guest-user', class: 'auth__icon' }
    );
    const authForm = this.createElement('form', auth, { class: 'auth-form' });
    const emailContainer = this.createElement('div', authForm, { class: 'form-item' });
    const emailLabel = this.createElement('label', emailContainer, { for: 'email', class: 'form-item__label' }, 'Электронная почта');
    const emailField = this.createElement('input', emailContainer, {
      id: 'email',
      type: 'email',
      class: 'form-item__text-input',
      required: 'required',
    });
    const passwordContainer = this.createElement('div', authForm, { class: 'form-item' });
    const passwordLabel = this.createElement('label', passwordContainer, { for: 'password', class: 'form-item__label' }, 'Пароль');
    const passwordField = this.createElement('input', passwordContainer, {
      id: 'password',
      type: 'password',
      class: 'form-item__text-input',
      minLength: '8',
      required: 'required',
    });
    const submitButton = this.createElement('button', authForm, { type: 'submit', class: 'form__submit-button' }, 'Войти');
    const authAddInfo = this.createElement('span', auth, { class: 'auth-add-info' }, 'Нет аккаунта?');
    const link = this.createElement('a', authAddInfo, { href: '', class: 'auth-add-info__link' }, 'Зарегистрируйтесь');
    Object.assign(this.elements.htmlElements, {
      cancelButton,
      link,
      authForm,
      emailField,
      passwordField,
    });
  }

  drawSignUp(): void {
    const { auth } = this.elements.htmlElements;
    auth.innerHTML = '';

    const cancelButton = this.createElement('button', auth, { class: 'auth__cancel-button' });
    const authForm = this.createElement('form', auth, { class: 'auth-form' });
    const genderContainer = this.createElement('div', authForm, { class: 'form-item avatars' });
    const maleInput = this.createElement('input', genderContainer, {
      id: 'male',
      name: 'gender',
      value: 'male',
      type: 'radio',
      class: 'form-item__radio-input',
      required: 'required',
      checked: 'checked',
    });
    const maleLabel = this.createElement('label', genderContainer, { for: 'male', class: 'form-item__label' });
    const femaleInput = this.createElement('input', genderContainer, {
      id: 'female',
      name: 'gender',
      value: 'female',
      type: 'radio',
      class: 'form-item__radio-input',
      required: 'required',
    });
    const femaleLabel = this.createElement('label', genderContainer, { for: 'female', class: 'form-item__label' });
    const nameContainer = this.createElement('div', authForm, { class: 'form-item' });
    const nameLabel = this.createElement('label', nameContainer, { for: 'name', class: 'form-item__label' }, 'Имя');
    const nameField = this.createElement('input', nameContainer, {
      id: 'name',
      type: 'text',
      class: 'form-item__text-input',
      required: 'required',
    });
    const emailContainer = this.createElement('div', authForm, { class: 'form-item' });
    const emailLabel = this.createElement('label', emailContainer, { for: 'email', class: 'form-item__label' }, 'Электронная почта');
    const emailField = this.createElement('input', emailContainer, {
      id: 'email',
      type: 'email',
      class: 'form-item__text-input',
      required: 'required',
    });
    const passwordContainer = this.createElement('div', authForm, { class: 'form-item' });
    const passwordLabel = this.createElement('label', passwordContainer, { for: 'password', class: 'form-item__label' }, 'Пароль');
    const passwordField = this.createElement('input', passwordContainer, {
      id: 'password',
      type: 'password',
      class: 'form-item__text-input',
      minLength: '8',
      required: 'required',
    });
    const submitButton = this.createElement('button', authForm, { type: 'submit', class: 'form__submit-button' }, 'Зарегистрироваться');
    const authAddInfo = this.createElement('span', auth, { class: 'auth-add-info' }, 'Уже есть аккаунт?');
    const link = this.createElement('a', authAddInfo, { href: '', class: 'auth-add-info__link' }, 'Авторизуйтесь');
    Object.assign(this.elements.htmlElements, {
      cancelButton,
      link,
      authForm,
      maleInput,
      femaleInput,
      nameField,
      emailField,
      passwordField,
    });
  }

  drawErrorMessage(message: string): void {
    const { authForm } = this.elements.htmlElements;
    const errorMessage = document.createElement('p');
    errorMessage.classList.add('auth__error-message');
    errorMessage.textContent = message;
    authForm.after(errorMessage);
    Object.assign(this.elements.htmlElements, {
      errorMessage,
    });
  }

  drawSuccesMessage(message: string): void {
    const { authForm } = this.elements.htmlElements;
    const succesMessage = document.createElement('p');
    succesMessage.classList.add('auth__succes-message');
    succesMessage.textContent = message;
    authForm.after(succesMessage);
    Object.assign(this.elements.htmlElements, {
      succesMessage,
    });
  }

  clearAuthContainer(): void {
    const { auth } = this.elements.htmlElements;
    auth.innerHTML = '';
  }
}
