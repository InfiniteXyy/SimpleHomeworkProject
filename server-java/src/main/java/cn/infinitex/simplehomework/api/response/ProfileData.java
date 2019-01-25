package cn.infinitex.simplehomework.api.response;

import cn.infinitex.simplehomework.models.user.User;
import java.util.HashMap;
import java.util.Map;

/**
 * @author xuyiyang
 */
public class ProfileData {

  private User user;

  public ProfileData(User user) {
    this.user = user;
  }

  public Map<String, Object> getUserData() {
    return new HashMap<String, Object>(16) {{
      put("user", new HashMap<String, Object>(16) {{
        put("username", user.getUsername());
        put("image", user.getImage());
      }});
    }};
  }
}
