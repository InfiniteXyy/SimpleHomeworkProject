package cn.infinitex.simplehomework.api.response;

import cn.infinitex.simplehomework.models.group.Group;
import cn.infinitex.simplehomework.models.message.Message;
import cn.infinitex.simplehomework.models.user.User;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;

/**
 * @author xuyiyang
 */

@AllArgsConstructor
public class MessageData {

  private User author;
  private Message message;
  private Group group;

  public Map<String, Object> getData() {
    return new HashMap<String, Object>() {{
      put("id", message.getId());
      put("body", message.getBody());
      put("createdAt", message.getCreatedAt());
      put("imageUrl", message.getImageUrl());
      put("groupTitle", group.getTitle());
      put("payload", message.getPayload());
      put("author", new HashMap<String, Object>() {{
        put("username", author.getUsername());
        put("image", author.getImage());
      }});
    }};
  }

  public Map<String, Object> getJson() {
    return new HashMap<String, Object>() {{
      put("message", getData());
    }};
  }
}
