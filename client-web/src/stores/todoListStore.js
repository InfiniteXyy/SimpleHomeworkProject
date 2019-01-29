import { action, computed, observable } from 'mobx';
import agent from '../agent';

export class TodoListStore {
  @observable
  todoLists = [];

  @observable
  currentListId = undefined;

  @action
  loadTodos() {
    return agent.TodoList.get().then(
      action(({ lists }) => {
        this.todoLists = lists;
        if (this.currentListId === undefined) this.currentListId = lists[0].id;
      })
    );
  }

  @action
  addTodoList(title) {
    agent.TodoList.add(title).then(
      action(({ list }) => {
        this.todoLists.push(list);
      })
    );
  }

  @action
  addTodo(listId, content, deadlineAt) {
    agent.Todo.add(listId, content, deadlineAt).then(
      action(({ task }) => {
        this.todoLists.forEach(i => {
          if (i.id === listId) {
            i.tasks.push(task);
          }
        });
      })
    );
  }

  @computed
  get currentTasks() {
    if (!this.currentListId) {
      return [];
    } else {
      return this.todoLists.filter(i => i.id === this.currentListId)[0].tasks;
    }
  }
  @action
  toggleList(id) {
    this.currentListId = id;
  }
}

export default new TodoListStore();
