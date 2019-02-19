import { observable, action, computed } from 'mobx';
import agent from '../agent';
import { createTransformer } from 'mobx-utils';
import cardStore from './cardStore';

export class GroupStore {
  @observable
  groups = [];

  @observable
  currentGroup = undefined;

  @observable
  groupDetail = undefined;

  @observable
  groupMessages = undefined;

  @observable
  groupCards = undefined;

  @observable
  searchedGroups = [];

  @observable
  isSearching = false;

  @action
  searchGroup(title = '', nameId = '') {
    this.isSearching = true;
    return agent.Group.search(nameId, title).then(
      action(({ groups }) => {
        this.searchedGroups = groups;
        this.isSearching = false;
        this.searchedGroups.forEach(i => {
          i.hasJoined = this.groups.findIndex(j => j.id === i.id) !== -1;
        });
      })
    );
  }

  @action
  resetSearch() {
    this.searchedGroups = [];
  }

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
  loadCards() {
    return agent.GroupCard.get(this.currentGroup.id).then(
      action(({ cards }) => {
        this.groupCards = cards;
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
    this.groupCards = undefined;
  }

  @action
  submitMessage(content, payload) {
    return agent.Message.add(this.currentGroup.id, payload, content).then(
      action(({ message }) => {
        this.groupMessages.push(message);
      })
    );
  }

  @computed
  get hasJoined() {
    return createTransformer(groupCardId => {
      if (cardStore.cards === undefined) {
        cardStore.loadCards();
        return false;
      }
      return cardStore.cards.findIndex(i => i.groupCardId === groupCardId) !== -1;
    });
  }
}

export default new GroupStore();
