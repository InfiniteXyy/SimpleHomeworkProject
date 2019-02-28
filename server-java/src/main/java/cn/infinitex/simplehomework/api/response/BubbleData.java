package cn.infinitex.simplehomework.api.response;

import cn.infinitex.simplehomework.models.chat.Bubble;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class BubbleData {
  private Bubble bubble;

  public Map<String, Object> getJson() {
    return new HashMap<String, Object>() {{
      put("bubble", getData());
    }};
  }

  public Map<String, Object> getData() {
    return new HashMap<String, Object>() {{
      put("createdAt", bubble.getCreatedAt());
      put("content", bubble.getContent());
      put("dest", bubble.getDestUsername());
      put("from", bubble.getUsername());
    }};
  }


}
