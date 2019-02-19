package cn.infinitex.simplehomework.api.response;

import cn.infinitex.simplehomework.models.user.User;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;

/**
 * @author xuyiyang
 */

@AllArgsConstructor
public class ProfileData {

  private User user;

  private List<UserGroupData> userGroupData;

  private List<MessageData> messages;

  public ProfileData(User user) {
    this.user = user;
  }

  public Map<String, Object> getJson() {
    return new HashMap<String, Object>() {{
      put("user", getData());
    }};
  }

  public Map<String, Object> getData() {
    return new HashMap<String, Object>() {{
      put("username", user.getUsername());
      put("image", user.getImage());
      put("id", user.getId());
      if (messages != null) {
        put("messages", messages.stream().map(MessageData::getData));
      }
      if (userGroupData != null) {
        put("groups", userGroupData.stream().map(UserGroupData::getData));
      }
    }};
  }
}
