package cn.infinitex.simplehomework.api.response;

import cn.infinitex.simplehomework.models.card.Card;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class CardData {

  private Card card;


  public Map<String, Object> getData() {
    return new HashMap<String, Object>() {{
      put("id", card.getId());
      put("title", card.getTitle());
      put("coverImg", card.getCoverImg());
      put("creatorTitle", card.getCreatorTitle());
      put("groupId", card.getGroupId());
      put("weekdays", Arrays.stream(card.getWeekdays().split(","))
          .map(Integer::valueOf)
          .collect(Collectors.toList()));
      put("daytime", card.getDaytime());
    }};
  }

  public Map<String, Object> getJson() {
    return new HashMap<String, Object>() {{
      put("card", getData());
    }};
  }

}
