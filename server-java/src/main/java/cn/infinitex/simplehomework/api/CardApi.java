package cn.infinitex.simplehomework.api;

import cn.infinitex.simplehomework.api.response.CardData;
import cn.infinitex.simplehomework.models.card.Card;
import cn.infinitex.simplehomework.models.card.CardRepository;
import cn.infinitex.simplehomework.models.user.User;
import cn.infinitex.simplehomework.service.Auth;
import cn.infinitex.simplehomework.utils.JsonHelper;
import cn.infinitex.simplehomework.utils.ValidationHandler;
import com.fasterxml.jackson.annotation.JsonRootName;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/card")
public class CardApi {

  private Auth auth;
  private CardRepository cardRepository;

  @Autowired
  public CardApi(Auth auth, CardRepository cardRepository) {
    this.auth = auth;
    this.cardRepository = cardRepository;
  }

  @PostMapping("/")
  public ResponseEntity createCard(
      @RequestHeader(value = "Authorization") String authorization,
      @Valid @RequestBody NewCardParam newCardParam,
      BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      return ResponseEntity.status(422).body(ValidationHandler.serialize(bindingResult));
    }
    try {
      User user = auth.authorize(authorization);
      Card card = new Card(
          user.getId(),
          newCardParam.getTitle(),
          Long.valueOf(newCardParam.getGroupId()),
          newCardParam.getCreatorTitle(),
          newCardParam.getWeekdays(),
          newCardParam.getDaytime(),
          newCardParam.getCoverImg());

      cardRepository.save(card);
      return ResponseEntity.ok(new CardData(card).getJson());
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }

  @RequestMapping(method = RequestMethod.GET)
  public ResponseEntity getMyCards(
      @RequestHeader(value = "Authorization") String authorization
  ) {
    try {
      User user = auth.authorize(authorization);
      List<Map<String, Object>> result = cardRepository.findByUserId(user.getId()).stream()
          .map(CardData::new)
          .map(CardData::getData)
          .collect(Collectors.toList());
      return ResponseEntity.ok(JsonHelper.object("cards", result));
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }

}

@Getter
@JsonRootName("card")
class NewCardParam {
  @NotBlank
  private String title;
  private String groupId = "0";
  private String creatorTitle;
  @NotBlank
  private String weekdays;
  @NotBlank
  private String daytime;
  private String coverImg = "";
}
