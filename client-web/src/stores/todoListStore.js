import { action, computed, observable } from 'mobx';

let temp = new Date();
temp.setDate(30);
export class TodoListStore {
  @observable
  todos = [
    {
      id: '1',
      content: '作业1',
      deadlineAt: temp,
      createdAt: new Date(),
      createdBy: '计算机网络1班',
      finished: false,
      listId: '1'
    },
    {
      id: '2',
      content: '作业2',
      deadlineAt: new Date(),
      createdAt: new Date(),
      createdBy: '计算机网络2班',
      finished: false,
      listId: '1'
    }
  ];

  @observable currentListId = '1';
  @observable showOnlyFinished = false;

  @computed
  get todosInList() {
    const temp = this.todos.filter(i => i.listId === this.currentListId);
    if (this.showOnlyFinished) {
      return temp.filter(i => !i.finished);
    } else {
      return temp;
    }
  }

  @action
  toggleShowAll(type) {
    this.showOnlyFinished = !type;
  }

  @action
  toggleList(id) {
    this.currentListId = id;
  }

  @action
  toggleTodo(id) {
    let temp = this.todos.filter(i => i.id === id);
    if (temp.length < 1) {
      return null;
    } else {
      temp[0].finished = !temp[0].finished;
    }
  }
}

export default new TodoListStore();
