import { action, computed, observable } from 'mobx';
import agent from '../agent';
import moment from 'moment';

class CardStore {
  @observable cards = undefined;

  @observable cardLogs = [];

  @action
  loadCards() {
    return agent.Card.get().then(({ cards }) => {
      this.getLogs().then(() => {
        this.cards = cards.sort((a, b) => {
          return Date.parse('01/01/2019 ' + a.daytime) - Date.parse('01/01/2019 ' + b.daytime);
        });
      });
    });
  }

  @action
  createCard(title, creatorTitle, weekdays, daytime, coverImg) {
    return agent.Card.create(title, creatorTitle, weekdays, daytime, coverImg).then(({ card }) => {
      this.cards.push(card);
    });
  }

  @action
  deleteLog(log) {
    return agent.Card.deleteLog(log.id).then(() => {
      this.cardLogs.remove(log);
    });
  }

  @action
  check(cardId) {
    return agent.Card.check(cardId).then(({ log }) => {
      this.cardLogs.push(log);
    });
  }

  @action
  getLogs() {
    return agent.Card.getLogs().then(({ logs }) => {
      this.cardLogs = logs;
    });
  }

  @computed
  get currentStep() {
    const step = this.todayCards.findIndex(i => this.cardLogs.findIndex(log => log.cardId === i.id) === -1);
    return step === -1 ? this.todayCards.length : step;
  }

  @computed
  get todayCards() {
    if (this.cards === undefined) return [];
    return this.cards.filter(i => i.weekdays.indexOf(this.today) !== -1);
  }

  @computed
  get today() {
    const isoWD = [2, 3, 4, 5, 6, 7, 1];
    return isoWD[moment().isoWeekday() - 1];
  }
}

export default new CardStore();
