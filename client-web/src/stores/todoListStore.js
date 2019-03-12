import { action, observable } from 'mobx';
import agent from '../agent';

export class TodoListStore {
  @observable
  todoLists = undefined;

  @observable
  currentTodo = undefined;

  @observable
  todoOpen = false;

  @action
  openTodo(todo) {
    this.currentTodo = todo;
    this.todoOpen = true;
  }

  @action
  closeTodo() {
    this.todoOpen = false;
  }

  @action
  loadTodos() {
    return agent.TodoList.get().then(
      action(({ lists }) => {
        this.todoLists = lists.sort((a, b) => (a.id - b.id));
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
  addTodo(listId, content, deadlineAt, remarks, imageUrl) {
    return agent.Todo.add(listId, content, deadlineAt, remarks, imageUrl).then(
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

  @action
  deleteTodo(todo) {
    return agent.Todo.delete(todo.id).then(
      action(() => {
        this.todoLists.forEach(list => {
          list.tasks.remove(todo);
        });
      })
    );
  }

  @action
  updateTodo(listId, content, deadlineAt, remarks) {
    return agent.Todo.update(this.currentTodo.id, listId, content, deadlineAt, remarks).then(
      action(({ task }) => {
        this.currentTodo.listId = task.listId;
        this.currentTodo.content = task.content;
        this.currentTodo.deadlineAt = task.deadlineAt;
        this.currentTodo.remarks = task.remarks;
        this.todoLists.forEach(list => {
          let temp = list.tasks.find(i => i.id === this.currentTodo.id);
          list.tasks.remove(temp);
          if (list.id.toString() === listId) {
            list.tasks.push(task);
          }
        });
      })
    );
  }
}

export default new TodoListStore();
