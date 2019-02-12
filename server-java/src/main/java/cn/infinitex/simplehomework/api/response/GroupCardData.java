package cn.infinitex.simplehomework.api.response;

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

  private List<User> members;

  public GroupCardData(GroupCard groupCard) {
    this.groupCard = groupCard;
  }

  public Map<String, Object> getData() {
    return new HashMap<String, Object>() {{
      put("id", groupCard.getId());
      put("title", groupCard.getTitle());
      put("coverImg", groupCard.getCoverImg());
      put("daytime", groupCard.getDaytime());
      put("weekdays", Arrays.stream(groupCard.getWeekdays().split(","))
          .map(Integer::valueOf)
          .collect(Collectors.toList()));
      if (members != null) {
        put("members", members.stream().map(ProfileData::new).map(ProfileData::getData).collect(
            Collectors.toList()));
      }
    }};
  }

  public Map<String, Object> getJson() {
    return new HashMap<String, Object>() {{
      put("card", getData());
    }};
  }
}
