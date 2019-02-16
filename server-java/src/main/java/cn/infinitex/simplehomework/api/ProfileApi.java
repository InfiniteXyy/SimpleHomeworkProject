package cn.infinitex.simplehomework.api;

import cn.infinitex.simplehomework.api.response.MessageData;
import cn.infinitex.simplehomework.api.response.ProfileData;
import cn.infinitex.simplehomework.api.response.UserGroupData;
import cn.infinitex.simplehomework.models.group.GroupRepository;
import cn.infinitex.simplehomework.models.message.MessageRepository;
import cn.infinitex.simplehomework.models.user.User;
import cn.infinitex.simplehomework.models.user.UserRepository;
import cn.infinitex.simplehomework.models.usergroup.UserGroupRepository;
import cn.infinitex.simplehomework.utils.ValidationHandler;
import java.util.HashMap;
import java.util.Optional;
import java.util.stream.Collectors;
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
  private MessageRepository messageRepository;
  private UserGroupRepository userGroupRepository;
  private GroupRepository groupRepository;

  @Autowired
  public ProfileApi(UserRepository userRepository,
      MessageRepository messageRepository,
      UserGroupRepository userGroupRepository,
      GroupRepository groupRepository) {
    this.userRepository = userRepository;
    this.messageRepository = messageRepository;
    this.userGroupRepository = userGroupRepository;
    this.groupRepository = groupRepository;
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
      User user = optionalUser.get();
      return ResponseEntity.ok(new ProfileData(
          user,
          userGroupRepository.findByUserId(user.getId()).stream()
              .map(i -> new UserGroupData(i, groupRepository.findById(i.getGroupId()).get()))
              .collect(Collectors.toList()),
          messageRepository.findTopMessagesByUserId(user.getId()).stream()
              .map(i -> new MessageData(user, i, groupRepository.findById(i.getGroupId()).get()))
              .collect(Collectors.toList())
          ).getJson()
      );
    }
  }
}
