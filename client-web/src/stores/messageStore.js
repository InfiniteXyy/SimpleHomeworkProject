import { action, observable } from 'mobx';
import agent from '../agent';

export class MessageStore {
  @observable messages = undefined;

  @action
  loadMessages() {
    return agent.Message.get().then(
      action(({ messages }) => {
        this.messages = messages;
      })
    );
  }

  @action
  loadMore() {
    if (!this.messages || this.messages.length === 0) return;
    const lastMessage = this.messages[this.messages.length - 1];
    return agent.Message.loadMore(lastMessage.createdAt).then(
      action(({ messages }) => {
        this.messages = [...this.messages, messages];
      })
    );
  }
}

export default new MessageStore();
