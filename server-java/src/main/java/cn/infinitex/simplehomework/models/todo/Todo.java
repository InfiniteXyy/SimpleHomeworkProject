package cn.infinitex.simplehomework.models.todo;

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
public class Todo {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;
  private long listId;
  private String content;
  private String deadlineAt;
  private String createdAt;
  private String noticeAt;
  private String imageUrl;
  private Boolean finished;

  public Todo(long listId, String content, String deadlineAt, String noticeAt,
      String imageUrl) {
    this.listId = listId;
    this.content = content;
    this.deadlineAt = deadlineAt;
    this.createdAt = new DateTime().toString();
    this.noticeAt = noticeAt;
    this.imageUrl = imageUrl;
    this.finished = false;
  }
}
