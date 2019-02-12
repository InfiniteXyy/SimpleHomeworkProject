package cn.infinitex.simplehomework.models.card;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class CardLog {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;
  private long cardId;
  private String checkTime;

  public CardLog(long cardId, String checkTime) {
    this.cardId = cardId;
    this.checkTime = checkTime;
  }
}
