package cn.infinitex.simplehomework.api.response;

import cn.infinitex.simplehomework.models.todo.Todo;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class TodoData {

  private Todo todo;

  public Map<String, Object> getJson() {
    return new HashMap<String, Object>() {{
      put("task", getData());
    }};
  }

  public Map<String, Object> getData() {
    return new HashMap<String, Object>() {{
      put("id", todo.getId());
      put("content", todo.getContent());
      put("deadlineAt", todo.getDeadlineAt());
      put("noticeAt", todo.getNoticeAt());
    }};
  }

}
