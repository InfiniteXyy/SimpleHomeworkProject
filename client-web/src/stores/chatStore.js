import { observable, action, computed } from 'mobx';
import agent from '../agent';

class ChatStore {
  @observable
  bubbles = undefined;

  @observable
  currentIndex = undefined;

  @action
  loadBubbles() {
    return agent.Chat.get().then(({ bubbles }) => {
      this.bubbles = bubbles.sort((a, b) => {
        return a.createdAt > b.createdAt ? 1 : -1;
      });
    });
  }

  @computed
  get chatPages() {
    if (this.bubbles === undefined) {
      return undefined;
    }
    let pages = [];
    for (let bubble of this.bubbles) {
      if (bubble.type === 'send') {
        let index = pages.findIndex(i => i.person === bubble.dest);
        if (index === -1) {
          pages.push({ person: bubble.dest, avatar: bubble.avatar, bubbles: [bubble] });
        } else {
          pages[index].bubbles.push(bubble);
        }
      } else {
        let index = pages.findIndex(i => i.person === bubble.from);
        if (index === -1) {
          pages.push({ person: bubble.from, avatar: bubble.avatar, bubbles: [bubble] });
        } else {
          pages[index].bubbles.push(bubble);
        }
      }
    }
    return pages;
  }

  @action
  togglePage(index) {
    this.currentIndex = index;
  }
  @action
  handleSend(content) {
    return agent.Chat.send(content, this.currentPage.person).then(({ bubble }) => {
      bubble.type = 'send';
      this.bubbles.push(bubble);
    });
  }

  @computed
  get currentPage() {
    if (!this.chatPages) return undefined;
    return this.chatPages[this.currentIndex];
  }
}

export default new ChatStore();
