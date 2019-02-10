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
  private String remarks;


  public Todo(long listId, String content, String deadlineAt, String noticeAt,
      String imageUrl, String remarks) {
    this.listId = listId;
    this.content = content;
    this.deadlineAt = deadlineAt;
    this.createdAt = new DateTime().toString();
    this.noticeAt = noticeAt;
    this.imageUrl = imageUrl;
    this.finished = false;
    this.remarks = remarks;
  }

  public void setFinished(Boolean finished) {
    this.finished = finished;
  }

  public void update(Long listId, String content, String deadlineAt, String imageUrl,
      String noticeAt, String remarks) {
    if (0 != listId) {
      this.listId = listId;
    }
    if (!"".equals(content)) {
      this.content = content;
    }
    if (!"".equals(deadlineAt)) {
      this.deadlineAt = deadlineAt;
    }
    if (!"".equals(imageUrl)) {
      this.imageUrl = imageUrl;
    }
    if (!"".equals(noticeAt)) {
      this.noticeAt = noticeAt;
    }
    if (!"".equals(remarks)) {
      this.remarks = remarks;
    }
  }
}
