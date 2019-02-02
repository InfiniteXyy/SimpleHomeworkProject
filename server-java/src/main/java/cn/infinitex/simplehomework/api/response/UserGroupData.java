package cn.infinitex.simplehomework.api.response;

import cn.infinitex.simplehomework.models.usergroup.UserGroup;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UserGroupData {

  private UserGroup userGroup;

  public Map<String, Object> getJson() {
    return new HashMap<String, Object>() {{
      put("userGroup", getData());
    }};

  }

  public Map<String, Object> getData() {
    return new HashMap<String, Object>() {{
      put("tag", userGroup.getTags());
      put("joinAt", userGroup.getAttendedIn());
    }};

  }

}
