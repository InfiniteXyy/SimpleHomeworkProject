package cn.infinitex.simplehomework.models.chat;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.joda.time.DateTime;

@Entity
@Getter
@NoArgsConstructor
public class Bubble {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  private long userId;
  private String username;
  private String destUsername;
  private long destUserId;

  private String content;

  private String createdAt;

  public Bubble(long userId, String username, String destUsername, long destUserId,
      String content) {
    this.userId = userId;
    this.username = username;
    this.destUsername = destUsername;
    this.destUserId = destUserId;
    this.content = content;
    this.createdAt = new DateTime().toString();
  }
}
