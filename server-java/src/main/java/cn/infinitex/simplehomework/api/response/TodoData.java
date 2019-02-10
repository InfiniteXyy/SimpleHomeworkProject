package cn.infinitex.simplehomework.api.response;

import cn.infinitex.simplehomework.models.todo.Todo;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
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
      put("listId", todo.getListId());
      put("content", todo.getContent());
      put("deadlineAt", todo.getDeadlineAt());
      put("noticeAt", todo.getNoticeAt());
      put("finished", todo.getFinished());
      put("remarks", todo.getRemarks() == null ?
          new ArrayList() :
          Arrays.stream(todo
              .getRemarks()
              .split("\n"))
              .filter(i -> !"".equals(i))
              .collect(Collectors.toList()));
    }};
  }

}
