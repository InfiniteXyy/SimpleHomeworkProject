package cn.infinitex.simplehomework.api;

import cn.infinitex.simplehomework.api.response.CardLogData;
import cn.infinitex.simplehomework.models.card.Card;
import cn.infinitex.simplehomework.models.card.CardLog;
import cn.infinitex.simplehomework.models.card.CardLogRepository;
import cn.infinitex.simplehomework.models.card.CardRepository;
import cn.infinitex.simplehomework.models.user.User;
import cn.infinitex.simplehomework.service.Auth;
import cn.infinitex.simplehomework.utils.DateHelper;
import cn.infinitex.simplehomework.utils.JsonHelper;
import cn.infinitex.simplehomework.utils.Pair;
import cn.infinitex.simplehomework.utils.ValidationHandler;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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

  @RequestMapping(method = RequestMethod.POST)
  public ResponseEntity checkCard(
      @RequestHeader(value = "Authorization") String authorization,
      @RequestParam long cardId) {
    try {
      User user = auth.authorize(authorization);
      Optional<Card> cardOptional = cardRepository.findById(cardId);
      if (!cardOptional.isPresent()) {
        throw new Exception("cardId should not be null");
      }
      Card card = cardOptional.get();
      if (card.getUserId() != user.getId()) {
        throw new Exception("card doesn't belong to you");
      }

      CardLog cardLog = new CardLog(card.getId(), new DateTime().toString());
      cardLogRepository.save(cardLog);
      return ResponseEntity.ok(new CardLogData(cardLog).getJson());
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }

  @RequestMapping(method = RequestMethod.GET)
  public ResponseEntity getLog(
      @RequestHeader(value = "Authorization") String authorization
  ) {
    try {
      User user = auth.authorize(authorization);
      List<Long> cardIds = cardRepository.findByUserId(user.getId()).stream()
          .map(Card::getId)
          .collect(Collectors.toList());

      Pair<DateTime> dateRange = DateHelper.getDateRange(new DateTime());
      List<CardLog> cardLogs = cardLogRepository.findByCardIdInAndCheckTimeBetween(
          cardIds,
          dateRange.getLeft().toString(),
          dateRange.getRight().toString());
      return ResponseEntity.ok(JsonHelper.object("logs",
          cardLogs.stream()
              .map(CardLogData::new)
              .map(CardLogData::getData)
              .collect(Collectors.toList())));
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }

  @RequestMapping(method = RequestMethod.DELETE, value = "/{logId}")
  public ResponseEntity deleteLog(
      @RequestHeader(value = "Authorization") String authorization,
      @PathVariable String logId
  ) {
    try {
      User user = auth.authorize(authorization);
      Optional<CardLog> cardLogOptional = cardLogRepository.findById(Long.valueOf(logId));
      if (!cardLogOptional.isPresent()) {
        throw new Exception("wrong log id");
      }
      CardLog cardLog = cardLogOptional.get();
      if (cardRepository.findById(cardLog.getCardId()).get().getUserId() != user.getId()) {
        throw new Exception("you are not authorized");
      }
      cardLogRepository.delete(cardLog);
      return ResponseEntity.ok("success");
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }
}
