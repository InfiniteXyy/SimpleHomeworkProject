package cn.infinitex.simplehomework.models.message;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.joda.time.DateTime;

/**
 * @author xuyiyang
 */
@Entity
@NoArgsConstructor
@Getter
public class Message {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;
  private String body;
  private String createdAt;
  private String imageUrl;
  private long userId;
  private long groupId;
  private String payload;

  public Message(String body, String imageUrl, long userId, long groupId,
      String payload) {
    this.createdAt = new DateTime().toString();
    this.body = body;
    this.imageUrl = imageUrl;
    this.userId = userId;
    this.groupId = groupId;
    this.payload = payload;
  }
}
