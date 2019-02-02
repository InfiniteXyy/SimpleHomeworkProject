package cn.infinitex.simplehomework.models.usergroup;

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
public class UserGroup {


  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  private long userId;
  private long groupId;

  private String tags;

  private String attendedIn;

  public UserGroup(long userId, long groupId) {
    this.userId = userId;
    this.groupId = groupId;
    this.attendedIn = new DateTime().toString();
  }

  public UserGroup(long userId, long groupId, String tags) {
    this.userId = userId;
    this.groupId = groupId;
    this.tags = tags;
    this.attendedIn = new DateTime().toString();
  }
}
