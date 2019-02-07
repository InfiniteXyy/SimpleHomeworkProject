package cn.infinitex.simplehomework.models.card;

import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Card {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;
  private long userId;

  private String title;

  private Long groupId;

  private String creatorTitle;

  private String weekdays;

  private String daytime;

  private String coverImg;

  public Card(long userId, String title, Long groupId, String creatorTitle, String weekdays,
      String daytime, String coverImg) {
    this.userId = userId;
    this.title = title;
    this.groupId = groupId;
    this.creatorTitle = creatorTitle;
    this.weekdays = weekdays;
    this.daytime = daytime;
    this.coverImg = coverImg;
  }
}
