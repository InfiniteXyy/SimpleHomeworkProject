import { action, observable } from 'mobx';
import agent from '../agent';

export class MessageStore {
  @observable messages = [];

  @action
  loadMessages() {
    return agent.Message.get().then(
      action(({ messages }) => {
        this.messages = messages;
      })
    );
  }
}

export default new MessageStore();
