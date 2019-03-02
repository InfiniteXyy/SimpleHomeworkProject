package cn.infinitex.simplehomework.models.message;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
public class UserMessage {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  private long userId;
  private long messageId;

  private boolean isLike;
  private boolean isRead;

  public UserMessage(long userId, long messageId, boolean isLike, boolean isRead) {
    this.userId = userId;
    this.messageId = messageId;
    this.isLike = isLike;
    this.isRead = isRead;
  }

  public void update(Boolean isLike, Boolean isRead) {
    if (isLike != null) {
      this.isLike = isLike;
    }
    if (isRead != null) {
      this.isRead = isRead;
    }
  }
}
