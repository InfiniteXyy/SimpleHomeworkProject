package cn.infinitex.simplehomework.models.group;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class GroupCard {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  private long groupId;

  private String title;

  private String weekdays;

  private String daytime;

  private String coverImg;

  public GroupCard(long groupId, String title, String weekdays, String daytime,
      String coverImg) {
    this.groupId = groupId;
    this.title = title;
    this.weekdays = weekdays;
    this.daytime = daytime;
    this.coverImg = coverImg;
  }
}
