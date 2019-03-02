package cn.infinitex.simplehomework.api;

import cn.infinitex.simplehomework.api.response.MessageData;
import cn.infinitex.simplehomework.api.response.ProfileData;
import cn.infinitex.simplehomework.models.group.GroupRepository;
import cn.infinitex.simplehomework.models.message.Message;
import cn.infinitex.simplehomework.models.message.MessageRepository;
import cn.infinitex.simplehomework.models.message.UserMessage;
import cn.infinitex.simplehomework.models.message.UserMessageRepository;
import cn.infinitex.simplehomework.models.user.User;
import cn.infinitex.simplehomework.models.user.UserRepository;
import cn.infinitex.simplehomework.models.usergroup.UserGroup;
import cn.infinitex.simplehomework.models.usergroup.UserGroupRepository;
import cn.infinitex.simplehomework.service.Auth;
import cn.infinitex.simplehomework.utils.JsonHelper;
import cn.infinitex.simplehomework.utils.ValidationHandler;
import com.fasterxml.jackson.annotation.JsonRootName;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
  private UserMessageRepository userMessageRepository;
  private UserRepository userRepository;
  private GroupRepository groupRepository;
  private UserGroupRepository userGroupRepository;
  private Auth auth;

  @Autowired
  public MessageApi(
      MessageRepository messageRepository,
      UserMessageRepository userMessageRepository,
      UserRepository userRepository,
      GroupRepository groupRepository,
      UserGroupRepository userGroupRepository, Auth auth) {
    this.messageRepository = messageRepository;
    this.userRepository = userRepository;
    this.userMessageRepository = userMessageRepository;
    this.groupRepository = groupRepository;
    this.userGroupRepository = userGroupRepository;
    this.auth = auth;
  }

  @RequestMapping(method = RequestMethod.GET)
  public ResponseEntity listMessages(
      @RequestHeader(value = "Authorization") String authorization,
      @RequestParam(value = "limit", defaultValue = "10") int limit,
      @RequestParam(value = "from", defaultValue = "") String from,
      @RequestParam(value = "groupId", defaultValue = "") String groupId,
      @RequestParam(value = "like", defaultValue = "false") Boolean like
  ) {
    try {
      User user = auth.authorize(authorization);

      List<Long> groupIds = userGroupRepository.findByUserId(user.getId()).stream().map(
          UserGroup::getGroupId).collect(
          Collectors.toList());

      List<Message> messages;
      if (like) {
        messages = messageRepository.findMessagesByIdIn(
            userMessageRepository
                .findByUserIdAndLikeIsTrue(user.getId())
                .stream()
                .map(UserMessage::getMessageId)
                .collect(Collectors.toList()));
      } else {
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
      }

      return ResponseEntity.ok(JsonHelper.object("messages", messages.stream().map(
          i -> new MessageData(
              userRepository.findById(i.getUserId()).get(),
              i,
              groupRepository.findById(i.getGroupId()).get()
          ).getData()
      )
          .peek(i -> {
            Optional<UserMessage> userMessage = userMessageRepository
                .findByUserIdAndMessageId(user.getId(),
                    (Long) i.get("id"));
            boolean isLike = false;
            boolean isRead = false;
            if (userMessage.isPresent()) {
              isLike = userMessage.get().isLike();
              isRead = userMessage.get().isRead();
            }
            i.put("like", isLike);
            i.put("read", isRead);
          })
          .collect(Collectors.toList())));
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

  @PostMapping("/{messageId}")
  public ResponseEntity toggleRelation(
      @RequestHeader(value = "Authorization") String authorization,
      @PathVariable long messageId,
      @RequestParam(value = "like", required = false) Boolean like,
      @RequestParam(value = "read", required = false) Boolean read
  ) {
    try {
      User user = auth.authorize(authorization);
      Optional<Message> messageOptional = messageRepository.findById(messageId);
      if (!messageOptional.isPresent()) {
        throw new Exception("message id wrong");
      }
      Message message = messageOptional.get();
      Optional<UserMessage> userMessageOptional = userMessageRepository
          .findByUserIdAndMessageId(user.getId(), messageId);

      UserMessage userMessage = userMessageOptional.orElseGet(() ->
          new UserMessage(user.getId(), messageId, false, false));

      userMessage.update(like, read);
      userMessageRepository.save(userMessage);
      return ResponseEntity.ok(JsonHelper.object(
          "result", new HashMap<String, Object>() {{
            put("id", message.getId());
            put("like", userMessage.isLike());
            put("read", userMessage.isRead());
          }}
      ));
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }

  @GetMapping("/read/{messageId}")
  public ResponseEntity getReadPeople(
      @PathVariable long messageId
  ) {
    try {
      Optional<Message> messageOptional = messageRepository.findById(messageId);
      if (!messageOptional.isPresent()) {
        throw new Exception("message id wrong");
      }
      Message message = messageOptional.get();
      List<Map<String, Object>> data = userGroupRepository.findByGroupId(message.getGroupId())
          .stream()
          .map(UserGroup::getUserId)
          .map(id -> userRepository.findById(id).get())
          .map(ProfileData::new)
          .map(ProfileData::getData)
          .peek(i -> {
            if (userMessageRepository
                .findByUserIdAndMessageId((Long) i.get("id"), messageId)
                .isPresent()) {
              i.put("read", true);
            } else {
              i.put("read", false);
            }
          })
          .collect(Collectors.toList());
      return ResponseEntity.ok(data);
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