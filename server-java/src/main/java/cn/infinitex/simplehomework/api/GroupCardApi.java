package cn.infinitex.simplehomework.api;

import cn.infinitex.simplehomework.api.response.GroupCardData;
import cn.infinitex.simplehomework.models.card.Card;
import cn.infinitex.simplehomework.models.card.CardRepository;
import cn.infinitex.simplehomework.models.group.Group;
import cn.infinitex.simplehomework.models.group.GroupCard;
import cn.infinitex.simplehomework.models.group.GroupCardRepository;
import cn.infinitex.simplehomework.models.group.GroupRepository;
import cn.infinitex.simplehomework.models.user.User;
import cn.infinitex.simplehomework.models.user.UserRepository;
import cn.infinitex.simplehomework.service.Auth;
import cn.infinitex.simplehomework.utils.JsonHelper;
import cn.infinitex.simplehomework.utils.ValidationHandler;
import com.fasterxml.jackson.annotation.JsonRootName;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/group/card")
public class GroupCardApi {

  private Auth auth;
  private GroupCardRepository groupCardRepository;
  private CardRepository cardRepository;
  private GroupRepository groupRepository;
  private UserRepository userRepository;

  @Autowired
  public GroupCardApi(Auth auth,
      GroupCardRepository groupCardRepository,
      CardRepository cardRepository,
      GroupRepository groupRepository,
      UserRepository userRepository) {
    this.auth = auth;
    this.groupCardRepository = groupCardRepository;
    this.cardRepository = cardRepository;
    this.groupRepository = groupRepository;
    this.userRepository = userRepository;
  }


  @RequestMapping(method = RequestMethod.GET)
  public ResponseEntity getGroupCards(
      @RequestParam long groupId
  ) {
    try {
      if (!groupRepository.findById(groupId).isPresent()) {
        throw new Exception("groupId wrong");
      }
      return ResponseEntity.ok(JsonHelper.object("cards",
          groupCardRepository.findByGroupId(groupId).stream()
              .map(i -> new GroupCardData(
                  i,
                  cardRepository.findByGroupCardId(i.getId()).stream()
                      .map(Card::getUserId)
                      .map(id -> userRepository.findById(id).get())
                      .collect(Collectors.toList())
              ))
              .map(GroupCardData::getData)
              .collect(Collectors.toList())
      ));


    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }

  @RequestMapping(method = RequestMethod.POST)
  public ResponseEntity createGroupCard(
      @RequestHeader(value = "Authorization") String authorization,
      @Valid @RequestBody NewGroupCardApi newGroupCardApi,
      BindingResult bindingResult
  ) {
    if (bindingResult.hasErrors()) {
      return ResponseEntity.status(422).body(ValidationHandler.serialize(bindingResult));
    }
    try {
      User user = auth.authorize(authorization);
      Optional<Group> groupOptional = groupRepository
          .findById(Long.valueOf(newGroupCardApi.getGroupId()));
      if (!groupOptional.isPresent()) {
        throw new Exception("wrong group id");
      }
      Group group = groupOptional.get();
      if (group.getCreatorId() != user.getId()) {
        throw new Exception("you are not authorized");
      }
      GroupCard groupCard = new GroupCard(
          Long.valueOf(newGroupCardApi.getGroupId()),
          newGroupCardApi.getTitle(),
          newGroupCardApi.getWeekdays(),
          newGroupCardApi.getDaytime(),
          newGroupCardApi.getCoverImg()
      );
      groupCardRepository.save(groupCard);
      return ResponseEntity.ok(new GroupCardData(groupCard).getJson());

    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }


}

@JsonRootName("card")
@Getter
class NewGroupCardApi {

  @NotBlank
  private String groupId;

  @NotBlank
  private String title;
  @NotBlank
  private String weekdays;
  @NotBlank
  private String daytime;
  private String coverImg = "";
}
