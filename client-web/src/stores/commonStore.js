import { action, observable, reaction } from 'mobx';

class CommonStore {
  @observable appName = 'Simple Homework';
  @observable token = window.localStorage.getItem('jwt');
  @observable appLoaded = false;
  @observable snackbarPayload = { content: '', type: 'info' };
  @observable snackbarOpen = false;
  @observable notificationOpen = false;

  constructor() {
    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        } else {
          window.localStorage.removeItem('jwt');
        }
      }
    );
  }

  @action
  toggleNotification(toggle = true) {
    this.notificationOpen = toggle;
  }

  @action
  toggleSnackbar(content, type = 'success', toggle = true) {
    this.snackbarOpen = toggle;
    if (toggle) this.snackbarPayload = { content, type };
  }

  @action
  setAppLoaded() {
    this.appLoaded = true;
  }

  @action
  setToken(token) {
    this.token = token;
  }
}

export default new CommonStore();
