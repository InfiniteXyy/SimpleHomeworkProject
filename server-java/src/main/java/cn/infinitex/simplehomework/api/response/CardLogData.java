package cn.infinitex.simplehomework.api.response;

import cn.infinitex.simplehomework.models.card.CardLog;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class CardLogData {

  private CardLog log;

  public Map<String, Object> getData() {
    return new HashMap<String, Object>() {{
      put("id", log.getId());
      put("cardId", log.getCardId());
      put("checkTime", log.getCheckTime());
    }};
  }

  public Map<String, Object> getJson() {
    return new HashMap<String, Object>() {{
      put("log", getData());
    }};
  }
}
