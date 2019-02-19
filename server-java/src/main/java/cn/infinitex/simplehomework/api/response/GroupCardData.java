package cn.infinitex.simplehomework.api.response;

import cn.infinitex.simplehomework.models.card.CardLog;
import cn.infinitex.simplehomework.models.group.GroupCard;
import cn.infinitex.simplehomework.models.user.User;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class GroupCardData {

  private GroupCard groupCard;

  private User creator;

  private List<User> members;

  private List<CardLog> logs;

  public GroupCardData(GroupCard groupCard, User creator) {
    this.groupCard = groupCard;
    this.creator = creator;
  }

  private String getStatus(Long userId) {
    for (CardLog cardLog : logs) {
      if (cardLog.getUserId() == userId) {
        return cardLog.getCheckTime();
      }
    }
    return "";
  }

  public Map<String, Object> getData() {
    return new HashMap<String, Object>() {{
      put("id", groupCard.getId());
      put("title", groupCard.getTitle());
      put("coverImg", groupCard.getCoverImg());
      put("daytime", groupCard.getDaytime());
      put("description", groupCard.getDescription());
      put("weekdays", Arrays.stream(groupCard.getWeekdays().split(","))
          .map(Integer::valueOf)
          .collect(Collectors.toList()));
      put("creator", new ProfileData(creator).getData());
      put("place", groupCard.getPlace());
      if (members != null) {
        put("members", members.stream()
            .map(ProfileData::new)
            .map(ProfileData::getData)
            .peek(i -> i.put("finished", getStatus((Long) i.get("id"))))
            .collect(Collectors.toList()));
      }
    }};
  }

  public Map<String, Object> getJson() {
    return new HashMap<String, Object>() {{
      put("card", getData());
    }};
  }
}
