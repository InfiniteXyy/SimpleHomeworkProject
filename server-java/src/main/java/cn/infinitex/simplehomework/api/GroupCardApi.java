package cn.infinitex.simplehomework.api;

import cn.infinitex.simplehomework.api.response.GroupCardData;
import cn.infinitex.simplehomework.models.card.Card;
import cn.infinitex.simplehomework.models.card.CardLogRepository;
import cn.infinitex.simplehomework.models.card.CardRepository;
import cn.infinitex.simplehomework.models.group.Group;
import cn.infinitex.simplehomework.models.group.GroupCard;
import cn.infinitex.simplehomework.models.group.GroupCardRepository;
import cn.infinitex.simplehomework.models.group.GroupRepository;
import cn.infinitex.simplehomework.models.user.User;
import cn.infinitex.simplehomework.models.user.UserRepository;
import cn.infinitex.simplehomework.service.Auth;
import cn.infinitex.simplehomework.utils.DateHelper;
import cn.infinitex.simplehomework.utils.JsonHelper;
import cn.infinitex.simplehomework.utils.Pair;
import cn.infinitex.simplehomework.utils.ValidationHandler;
import com.fasterxml.jackson.annotation.JsonRootName;
import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import lombok.Getter;
import org.joda.time.DateTime;
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
  private CardLogRepository cardLogRepository;
  private GroupRepository groupRepository;
  private UserRepository userRepository;

  @Autowired
  public GroupCardApi(Auth auth,
      GroupCardRepository groupCardRepository,
      CardRepository cardRepository,
      CardLogRepository cardLogRepository,
      GroupRepository groupRepository,
      UserRepository userRepository) {
    this.auth = auth;
    this.groupCardRepository = groupCardRepository;
    this.cardRepository = cardRepository;
    this.cardLogRepository = cardLogRepository;
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
      Pair<DateTime> dateRange = DateHelper.getDateRange(new DateTime());
      String from = dateRange.getLeft().toString();
      String to = dateRange.getRight().toString();
      return ResponseEntity.ok(JsonHelper.object("cards",
          groupCardRepository.findByGroupId(groupId).stream()
              .map(i -> new GroupCardData(
                  i,
                  userRepository.findById(i.getCreatorId()).get(),
                  cardRepository.findByGroupCardId(i.getId()).stream()
                      .map(Card::getUserId)
                      .map(id -> userRepository.findById(id).get())
                      .collect(Collectors.toList()),
                  cardLogRepository.findByCardIdInAndCheckTimeBetween(
                      cardRepository.findByGroupCardId(i.getId()).stream()
                          .map(Card::getId).collect(Collectors.toList()), from, to)
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
          newGroupCardApi.getCoverImg(),
          newGroupCardApi.getDescription(),
          user.getId(),
          newGroupCardApi.getPlace()
      );
      groupCardRepository.save(groupCard);
      return ResponseEntity.ok(new GroupCardData(groupCard, user).getJson());

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
  private String description = "";
  @NotBlank
  private String daytime;
  private String coverImg = "";
  private String place = "";
}
