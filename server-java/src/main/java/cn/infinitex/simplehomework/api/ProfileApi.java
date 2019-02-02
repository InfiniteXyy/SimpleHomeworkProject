package cn.infinitex.simplehomework.api;

import cn.infinitex.simplehomework.api.response.ProfileData;
import cn.infinitex.simplehomework.models.user.User;
import cn.infinitex.simplehomework.models.user.UserRepository;
import cn.infinitex.simplehomework.utils.ValidationHandler;
import java.util.HashMap;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author xuyiyang
 */
@RestController
@RequestMapping("api/profile/{username}")
public class ProfileApi {

  private UserRepository userRepository;

  @Autowired
  public ProfileApi(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @RequestMapping(method = RequestMethod.GET)
  public ResponseEntity userProfile(@PathVariable("username") String username) {
    Optional<User> optionalUser = userRepository.findByUsername(username);
    if (!optionalUser.isPresent()) {
      return ResponseEntity.status(404)
          .body(ValidationHandler.wrapErrorRoot(new HashMap<String, Object>(16) {{
            put("username", "not found");
          }}));
    } else {
      return ResponseEntity.ok(new ProfileData(optionalUser.get()).getJson());
    }
  }
}
