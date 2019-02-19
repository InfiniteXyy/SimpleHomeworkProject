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

  private Long groupCardId;

  private String creatorTitle;

  private String weekdays;

  private String daytime;

  private String coverImg;

  private String place;

  public Card(long userId, String title, Long groupCardId, String creatorTitle, String weekdays,
      String daytime, String coverImg, String place) {
    this.userId = userId;
    this.title = title;
    this.groupCardId = groupCardId;
    this.creatorTitle = creatorTitle;
    this.weekdays = weekdays;
    this.daytime = daytime;
    this.coverImg = coverImg;
    this.place = place;
  }
}
