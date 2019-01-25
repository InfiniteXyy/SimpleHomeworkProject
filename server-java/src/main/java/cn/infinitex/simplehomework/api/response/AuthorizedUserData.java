package cn.infinitex.simplehomework.api.response;

import cn.infinitex.simplehomework.models.user.User;
import java.util.HashMap;
import java.util.Map;

/**
 * @author xuyiyang
 */
public class AuthorizedUserData {

  private User user;
  private String token;

  public AuthorizedUserData(User user, String token) {
    this.user = user;
    this.token = token;
  }

  public Map<String, Object> getUserData() {
    return new HashMap<String, Object>(16) {{
      put("user", new HashMap<String, Object>(16) {{
        put("email", user.getEmail());
        put("token", token);
        put("username", user.getUsername());
        put("image", user.getImage());
      }});
    }};
  }
}
