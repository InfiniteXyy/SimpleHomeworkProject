import { observable, action } from 'mobx';
import agent from '../agent';

class ProfileStore {
  @observable
  userProfile = undefined;

  @action
  toggleProfile(username) {
    return agent.Profile.get(username).then(({ user }) => {
      this.userProfile = user;
    });
  }
}

export default new ProfileStore();
