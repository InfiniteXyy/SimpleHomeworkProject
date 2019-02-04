import { observable, action } from 'mobx';
import agent from '../agent';

export class GroupStore {
  @observable
  groups = [];

  @observable
  currentGroup = undefined;

  @observable
  groupDetail = undefined;

  @observable
  groupMessages = undefined;

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

  @action
  loadDetail() {
    return agent.Group.get(this.currentGroup.nameId).then(
      action(({ group }) => {
        this.groupDetail = group;
      })
    );
  }

  @action
  toggleGroup(group) {
    this.currentGroup = group;
  }

  @action
  loadMessage() {
    return agent.Message.get(this.currentGroup.id).then(
      action(({ messages }) => {
        this.groupMessages = messages;
      })
    );
  }

  @action
  loadMore() {
    return action(() => {
      if (!this.groupMessages || this.groupMessages.length === 0) return;
      const lastMessage = this.groupMessages[this.groupMessages.length - 1];
      return agent.Message.loadMore(lastMessage.createdAt, this.currentGroup.id).then(
        action(({ messages }) => {
          this.groupMessages = [...this.groupMessages, messages];
        })
      );
    });
  }

  @action
  clearDetail() {
    this.groupDetail = undefined;
    this.groupMessages = undefined;
    this.currentGroup = undefined;
  }

  @action
  submitMessage(content, payload) {
    return agent.Message.add(this.currentGroup.id, payload, content).then(
      action(({ message }) => {
        this.groupMessages.push(message);
      })
    );
  }
}

export default new GroupStore();
