package cn.infinitex.simplehomework.api.response;

import cn.infinitex.simplehomework.models.group.Group;
import cn.infinitex.simplehomework.models.user.User;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class GroupDetail {

  private Group group;
  private User creator;
  private List<User> members;

  public Map<String, Object> getData() {
    return new HashMap<String, Object>() {{
      put("id", group.getId());
      put("title", group.getTitle());
      put("nameId", group.getNameId());
      put("creator", new ProfileData(creator).getData());
      put("members", members.stream().map(i -> new ProfileData(i).getData()));
    }};
  }

  public Map<String, Object> getJson() {
    return new HashMap<String, Object>() {{
      put("group", getData());
    }};
  }

}
