package cn.infinitex.simplehomework.api;

import cn.infinitex.simplehomework.api.response.MessageData;
import cn.infinitex.simplehomework.models.group.GroupRepository;
import cn.infinitex.simplehomework.models.message.Message;
import cn.infinitex.simplehomework.models.message.MessageRepository;
import cn.infinitex.simplehomework.models.user.User;
import cn.infinitex.simplehomework.models.user.UserRepository;
import cn.infinitex.simplehomework.models.usergroup.UserGroup;
import cn.infinitex.simplehomework.models.usergroup.UserGroupRepository;
import cn.infinitex.simplehomework.service.Auth;
import cn.infinitex.simplehomework.utils.JsonHelper;
import cn.infinitex.simplehomework.utils.ValidationHandler;
import com.fasterxml.jackson.annotation.JsonRootName;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import lombok.Getter;
import org.joda.time.DateTime;
import org.joda.time.format.ISODateTimeFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author xuyiyang
 */
@RestController
@RequestMapping("api/messages")
public class MessageApi {

  private MessageRepository messageRepository;
  private UserRepository userRepository;
  private GroupRepository groupRepository;
  private UserGroupRepository userGroupRepository;
  private Auth auth;

  @Autowired
  public MessageApi(MessageRepository messageRepository,
      UserRepository userRepository,
      GroupRepository groupRepository,
      UserGroupRepository userGroupRepository, Auth auth) {
    this.messageRepository = messageRepository;
    this.userRepository = userRepository;
    this.groupRepository = groupRepository;
    this.userGroupRepository = userGroupRepository;
    this.auth = auth;
  }

  @RequestMapping(method = RequestMethod.GET)
  public ResponseEntity listMessages(
      @RequestHeader(value = "Authorization") String authorization,
      @RequestParam(value = "limit", defaultValue = "10") int limit,
      @RequestParam(value = "from", defaultValue = "") String from,
      @RequestParam(value = "groupId", defaultValue = "") String groupId) {
    try {
      User user = auth.authorize(authorization);

      List<Long> groupIds = userGroupRepository.findByUserId(user.getId()).stream().map(
          UserGroup::getGroupId).collect(
          Collectors.toList());

      List<Message> messages;
      if (!"".equals(from)) {
        DateTime dt = DateTime.parse(from, ISODateTimeFormat.dateTimeParser());
        if (!"".equals(groupId)) {
          messages = messageRepository
              .findTopMessagesByGroupIdSince(Long.valueOf(groupId), limit, dt.toString());
        } else {
          messages = messageRepository.findTopMessagesSince(groupIds, limit, dt.toString());
        }
      } else {
        if (!"".equals(groupId)) {
          messages = messageRepository.findTopMessagesByGroupId(Long.valueOf(groupId), limit);
        } else {
          messages = messageRepository.findTopMessages(groupIds, limit);
        }
      }

      return ResponseEntity.ok(JsonHelper.object("messages", messages.stream().map(
          i -> new MessageData(
              userRepository.findById(i.getUserId()).get(),
              i,
              groupRepository.findById(i.getGroupId()).get()
          ).getData()
      ).collect(Collectors.toList())));
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }

  @RequestMapping(method = RequestMethod.POST)
  public ResponseEntity createMessage(
      @RequestHeader(value = "Authorization") String authorization,
      @Valid @RequestBody NewMessageParam newMessageParam,
      BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      return ResponseEntity.status(422).body(ValidationHandler.serialize(bindingResult));
    }
    try {
      User user = auth.authorize(authorization);

      Long groupId = Long.valueOf(newMessageParam.getGroupId());

      Optional<UserGroup> userGroupOptional = userGroupRepository
          .findByUserIdAndGroupId(user.getId(), groupId);

      if (!userGroupOptional.isPresent()) {
        throw new Exception("you are not in this group");
      }
      String tag = userGroupOptional.get().getTags();
      if (!tag.equals("creator") && !tag.equals("admin")) {
        throw new Exception("you are not authorized to speak");
      }

      Message message = new Message(
          newMessageParam.getBody(),
          newMessageParam.getImageUrl(),
          user.getId(),
          groupId,
          newMessageParam.getPayload());

      messageRepository.save(message);

      return ResponseEntity.ok(new MessageData(user, message,
          groupRepository.findById(groupId).get()).getJson());
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }
}

@JsonRootName("message")
@Getter
class NewMessageParam {

  @NotBlank(message = "should not be empty")
  private String body;

  private String imageUrl = "";
  @Pattern(regexp = "^[0-9]*$", message = "should not be number")
  private String groupId;
  private String payload = "";
}