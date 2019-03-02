import { action, computed, observable, reaction } from 'mobx';
import cardStore from './cardStore';
import todoListStore from './todoListStore';
import moment from 'moment';

class CommonStore {
  @observable appName = 'Simple Homework';
  @observable token = window.localStorage.getItem('jwt');
  @observable appLoaded = false;
  @observable snackbarPayload = { content: '', type: 'info' };
  @observable snackbarOpen = false;
  @observable notificationOpen = false;
  @observable hasNotified = false;

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
  toggleNotification(toggle = true) {
    this.notificationOpen = toggle;
    this.hasNotified = true;
  }

  @action
  toggleSnackbar(content, type = 'success', toggle = true) {
    this.snackbarOpen = toggle;
    if (toggle) this.snackbarPayload = { content, type };
  }

  @action
  setAppLoaded() {
    this.appLoaded = true;
    todoListStore.loadTodos();
    cardStore.loadCards();
  }

  @action
  setToken(token) {
    this.token = token;
  }

  @computed
  get allTasks() {
    let tasks = [];
    if (todoListStore.todoLists) {
      for (let list of todoListStore.todoLists) {
        const title = list.title;
        for (let task of list.tasks) {
          tasks.push({
            title: task.content,
            time: task.deadlineAt,
            type: 'task',
            origin: title
          });
        }
      }
    }
    if (cardStore.todayCards) {
      tasks = [
        ...tasks,
        ...cardStore.todayCards.map(i => {
          return {
            title: i.title,
            time: Date.parse(moment().format('M/D/YYYY ') + i.daytime),
            type: 'card',
            origin: i.creatorTitle,
            place: i.place
          };
        })
      ];
    }
    return tasks;
  }
}

export default new CommonStore();
