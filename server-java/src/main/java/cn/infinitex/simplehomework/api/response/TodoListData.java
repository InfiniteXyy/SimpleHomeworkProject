package cn.infinitex.simplehomework.api.response;

import cn.infinitex.simplehomework.models.todo.Todo;
import cn.infinitex.simplehomework.models.todolist.TodoList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author xuyiyang
 */

public class TodoListData {

  private TodoList todoList;

  private List<Map<String, Object>> _tasks;

  public TodoListData(TodoList todoList,
      List<Todo> tasks) {
    this.todoList = todoList;
    this._tasks = tasks.stream().map(i -> new TodoData(i).getData()).collect(Collectors.toList());
  }


  public Map<String, Object> getJson() {
    return new HashMap<String, Object>() {{
      put("list", new HashMap<String, Object>() {{
        put("id", todoList.getId());
        put("title", todoList.getTitle());
        put("tasks", _tasks);
      }});
    }};
  }

  public Map<String, Object> getData() {
    return new HashMap<String, Object>() {{
      put("id", todoList.getId());
      put("title", todoList.getTitle());
      put("tasks", _tasks);
    }};
  }
}
