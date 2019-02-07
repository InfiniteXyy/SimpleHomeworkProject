import { observable, action } from 'mobx';
import agent from '../agent';

class CardStore {
  @observable cards = undefined;

  @action
  loadCards() {
    return agent.Card.get().then(({ cards }) => {
      this.cards = cards;
    });
  }

  @action
  createCard(title, creatorTitle, weekdays, daytime, coverImg) {
    return agent.Card.create(title, creatorTitle, weekdays, daytime, coverImg).then(({ card }) => {
      this.cards.push(card);
    });
  }
}

export default new CardStore();
