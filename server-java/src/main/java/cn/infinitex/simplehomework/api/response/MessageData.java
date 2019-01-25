package cn.infinitex.simplehomework.api.response;

import cn.infinitex.simplehomework.models.message.Message;
import cn.infinitex.simplehomework.models.user.User;
import java.util.HashMap;
import java.util.Map;

/**
 * @author xuyiyang
 */
public class MessageData {

  private User author;
  private Message message;

  public MessageData(User author, Message message) {
    this.author = author;
    this.message = message;
  }

  public Map<String, Object> getData() {
    return new HashMap<String, Object>(16) {{
      put("id", message.getId());
      put("body", message.getBody());
      put("createdAt", message.getCreatedAt());
      put("updatedAt", message.getUpdatedAt());
      put("imageUrl", message.getImageUrl());
      put("author", new HashMap<String, Object>(16) {{
        put("username", author.getUsername());
        put("image", author.getImage());
      }});
    }};
  }

  public Map<String, Object> getWrappedData() {
    return new HashMap<String, Object>(16) {{
      put("message", getData());
    }};
  }
}
