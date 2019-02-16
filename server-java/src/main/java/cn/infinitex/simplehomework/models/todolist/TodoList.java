package cn.infinitex.simplehomework.models.todolist;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class TodoList {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;
  private long userId;
  private String title;
  private boolean isArchived;

  public TodoList(long userId, String title) {
    this.userId = userId;
    this.title = title;
    this.isArchived = false;
  }

  public void update(String title) {
    this.title = title;
  }

  public void toggle(boolean isArchived) {
    this.isArchived = isArchived;
  }

}
