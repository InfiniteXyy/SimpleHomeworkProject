import { action, observable, reaction } from 'mobx';

class CommonStore {
  @observable appName = 'Simple Homework';
  @observable token = window.localStorage.getItem('jwt');
  @observable appLoaded = false;

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
  setAppLoaded() {
    this.appLoaded = true;
  }

  @action
  setToken(token) {
    this.token = token;
  }
}

export default new CommonStore();
