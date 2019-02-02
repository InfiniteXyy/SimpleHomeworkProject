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
        if (lists.length === 0) this.currentListId = 0;
        else if (this.currentListId === undefined) this.currentListId = lists[0].id;
      })
    );
  }

  @action
  addTodoList(title) {
    return agent.TodoList.add(title).then(
      action(({ list }) => {
        this.todoLists.push(list);
      })
    );
  }

  @action
  addTodo(listId, content, deadlineAt) {
    return agent.Todo.add(listId, content, deadlineAt).then(
      action(({ task }) => {
        this.todoLists.forEach(i => {
          if (i.id.toString() === listId) {
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
      if (this.todoLists.length === 0) return [];
      return this.todoLists.filter(i => i.id === this.currentListId)[0].tasks;
    }
  }
  @action
  toggleList(id) {
    this.currentListId = id;
  }
}

export default new TodoListStore();
