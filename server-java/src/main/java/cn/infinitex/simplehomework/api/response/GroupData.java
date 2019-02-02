package cn.infinitex.simplehomework.api.response;

import cn.infinitex.simplehomework.models.group.Group;
import cn.infinitex.simplehomework.models.user.User;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class GroupData {

  private Group group;
  private User creator;

  public Map<String, Object> getData() {
    return new HashMap<String, Object>() {{
      put("id", group.getId());
      put("title", group.getTitle());
      if (creator != null) {
        put("creator", new ProfileData(creator).getData());
      }
      put("nameId", group.getNameId());
    }};
  }

  public Map<String, Object> getJson() {
    return new HashMap<String, Object>() {{
      put("group", getData());
    }};
  }

  public GroupData(Group group) {
    this.group = group;
  }
}
