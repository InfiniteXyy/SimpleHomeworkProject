import { observable, action } from 'mobx';
import agent from '../agent';

export class GroupStore {
  @observable
  groups = [];

  @action
  createGroup(title, nameId) {
    return agent.Group.add(title, nameId).then(action(({ list }) => {}));
  }

  @action
  loadGroups() {
    return agent.Group.getMyGroups().then(
      action(({ groups }) => {
        this.groups = groups.map(item => ({ ...item.group, joinAt: item.joinAt, tag: item.tag }));
      })
    );
  }
}

export default new GroupStore();
