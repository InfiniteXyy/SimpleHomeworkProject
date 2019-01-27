package cn.infinitex.simplehomework.models.todo;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Note {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;
  private long todoId;
  private String cotent;
  private String createdAt;
}
