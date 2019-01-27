package cn.infinitex.simplehomework.api.response;

import cn.infinitex.simplehomework.models.todolist.TodoList;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;

/**
 * @author xuyiyang
 */

@AllArgsConstructor
public class TodoListData {

  private TodoList todoList;


  public Map<String, Object> getJson() {
    return new HashMap<String, Object>() {{
      put("todolist", new HashMap<String, Object>() {{
        put("title", todoList.getTitle());
      }});
    }};
  }
}
