package cn.infinitex.simplehomework.api;

import cn.infinitex.simplehomework.models.card.Card;
import cn.infinitex.simplehomework.models.card.CardLog;
import cn.infinitex.simplehomework.models.card.CardLogRepository;
import cn.infinitex.simplehomework.models.card.CardRepository;
import cn.infinitex.simplehomework.models.user.User;
import cn.infinitex.simplehomework.service.Auth;
import cn.infinitex.simplehomework.utils.JsonHelper;
import cn.infinitex.simplehomework.utils.ValidationHandler;
import com.fasterxml.jackson.annotation.JsonRootName;
import java.util.Optional;
import javax.validation.Valid;
import lombok.Getter;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/card/log")
public class CardLogApi {

  private Auth auth;

  private CardLogRepository cardLogRepository;
  private CardRepository cardRepository;

  @Autowired
  public CardLogApi(Auth auth,
      CardLogRepository cardLogRepository,
      CardRepository cardRepository) {
    this.auth = auth;
    this.cardLogRepository = cardLogRepository;
    this.cardRepository = cardRepository;
  }

  @PostMapping("/")
  public ResponseEntity checkCard(
      @RequestHeader(value = "Authorization") String authorization,
      @Valid @RequestBody NewCardLogParam newCardLogParam,
      BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      return ResponseEntity.status(422).body(ValidationHandler.serialize(bindingResult));
    }
    try {
      User user = auth.authorize(authorization);
      Optional<Card> cardOptional = cardRepository
          .findById(Long.valueOf(newCardLogParam.getCardId()));
      if (!cardOptional.isPresent()) {
        throw new Exception("cardId should not be null");
      }

      Card card = cardOptional.get();
      if (card.getUserId() != user.getId()) {
        throw new Exception("card doesn't belong to you");
      }

      CardLog cardLog = new CardLog(card.getId(), new DateTime().toString());
      cardLogRepository.save(cardLog);
      return ResponseEntity.ok("success");
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }
}

@JsonRootName("cardLog")
@Getter
class NewCardLogParam {

  private String checkTime;
  private String cardId;
}
