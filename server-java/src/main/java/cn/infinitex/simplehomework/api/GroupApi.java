package cn.infinitex.simplehomework.api;

import cn.infinitex.simplehomework.api.response.GroupData;
import cn.infinitex.simplehomework.api.response.GroupDetail;
import cn.infinitex.simplehomework.api.response.UserGroupData;
import cn.infinitex.simplehomework.models.group.Group;
import cn.infinitex.simplehomework.models.group.GroupRepository;
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

@RestController
@RequestMapping("api/group")
public class GroupApi {

  private GroupRepository groupRepository;
  private UserRepository userRepository;
  private UserGroupRepository userGroupRepository;
  private Auth auth;

  @Autowired
  public GroupApi(GroupRepository groupRepository,
      UserRepository userRepository,
      UserGroupRepository userGroupRepository, Auth auth) {
    this.groupRepository = groupRepository;
    this.userRepository = userRepository;
    this.userGroupRepository = userGroupRepository;
    this.auth = auth;
  }

  public static Group findGroupInList(List<Group> groups, long id) {
    for (Group g : groups) {
      if (g.getId() == id) {
        return g;
      }
    }
    return null;
  }


  @PostMapping
  public ResponseEntity createGroup(
      @RequestHeader(value = "Authorization") String authorization,
      @Valid @RequestBody NewGroupParam newGroupParam,
      BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      return ResponseEntity.status(422).body(ValidationHandler.serialize(bindingResult));
    }
    try {
      User user = auth.authorize(authorization);

      if (groupRepository.findByNameId(newGroupParam.getNameId()).isPresent()) {
        throw new Exception("nameId already used");
      }
      Group group = new Group(user.getId(), newGroupParam.getTitle(), newGroupParam.getNameId());
      groupRepository.save(group);
      userGroupRepository.save(new UserGroup(user.getId(), group.getId(), "creator"));
      return ResponseEntity.ok(new GroupData(group, user).getJson());

    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }

  @PostMapping("join")
  public ResponseEntity joinGroup(
      @RequestHeader(value = "Authorization") String authorization,
      @RequestParam long groupId) {
    try {
      User user = auth.authorize(authorization);
      if (userGroupRepository.findByUserIdAndGroupId(user.getId(), groupId).isPresent()) {
        throw new Exception("already joined");
      }
      UserGroup userGroup = new UserGroup(user.getId(), groupId);
      userGroupRepository.save(userGroup);
      return ResponseEntity.ok(new UserGroupData(userGroup).getJson());
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }

  }

  @PostMapping("leave")
  public ResponseEntity leaveGroup(
      @RequestHeader(value = "Authorization") String authorization,
      @RequestParam long groupId) {
    try {
      User user = auth.authorize(authorization);
      Optional<UserGroup> userGroup = userGroupRepository
          .findByUserIdAndGroupId(user.getId(), groupId);
      if (!userGroup.isPresent()) {
        throw new Exception("not joined");
      }
      userGroupRepository.delete(userGroup.get());
      return ResponseEntity.ok(JsonHelper.object("success", "leaved"));
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }

  @GetMapping("{nameId}")
  public ResponseEntity getGroupDetail(
      @PathVariable String nameId
  ) {
    Optional<Group> optionalGroup = groupRepository.findByNameId(nameId);
    if (!optionalGroup.isPresent()) {
      return ResponseEntity.status(404)
          .body(ValidationHandler.wrapErrorRoot(new HashMap<String, Object>() {{
            put("group", "not found");
          }}));
    } else {
      Group group = optionalGroup.get();
      User creator = userRepository.findById(group.getCreatorId()).get();

      List<User> members = userRepository
          .findByIdIn(userGroupRepository.findUserIdsByGroupId(group.getId()));
      return ResponseEntity.ok(new GroupDetail(group, creator, members).getJson());
    }
  }

  @RequestMapping(method = RequestMethod.GET)
  public ResponseEntity getGroups(
      @RequestHeader(value = "Authorization") String authorization
  ) {
    try {
      User user = auth.authorize(authorization);

      List<UserGroup> userGroups = userGroupRepository.findByUserId(user.getId());

      List<Long> groupIds = userGroups.stream().map(
          UserGroup::getGroupId).collect(
          Collectors.toList());

      List<Group> groups = groupRepository.findByIdIn(groupIds);

      List<Map<String, Object>> groupDataList = userGroups.stream()
          .map(i -> new UserGroupData(i, findGroupInList(groups, i.getGroupId())).getData())
          .collect(Collectors.toList());

      return ResponseEntity.ok(JsonHelper.object("groups", groupDataList));
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }

  @RequestMapping(value = "search", method = RequestMethod.GET)
  public ResponseEntity findGroups(
      @RequestParam(value = "nameId", defaultValue = "") String nameId,
      @RequestParam(value = "title", defaultValue = "") String title
  ) {
    try {
      if (!"".equals(nameId)) {
        Optional<Group> groupOptional = groupRepository.findByNameId(nameId);
        if (!groupOptional.isPresent()) {
          throw new Exception("wrong nameId");
        }
        Group group = groupOptional.get();
        User creator = userRepository.findById(group.getCreatorId()).get();
        return ResponseEntity.ok(new GroupData(group, creator).getJson());
      } else if (!"".equals(title)) {
        List<Group> groupList = groupRepository.findByTitleIgnoreCaseContaining(title);
        return ResponseEntity.ok(JsonHelper.object("groups",
            groupList.stream()
                .map(i -> new GroupData(i, userRepository.findById(i.getCreatorId()).get())
                    .getData())
                .collect(Collectors.toList()))
        );
      } else {
        throw new Exception("please specify nameId or title");
      }
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }

}

@JsonRootName("group")
@Getter
class NewGroupParam {

  @NotBlank
  private String title;
  @Pattern(regexp = "^\\w+$", message = "should be numbers or letters")
  private String nameId;
}


