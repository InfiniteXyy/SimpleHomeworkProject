import { action, observable } from 'mobx';
import agent from '../agent';

export class TodoListStore {
  @observable
  todoLists = undefined;

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

  @action
  toggleTodo(todo) {
    return agent.Todo.toggle(todo.id, !todo.finished).then(
      action(({ task }) => {
        todo.finished = task.finished;
      })
    );
  }
}

export default new TodoListStore();
