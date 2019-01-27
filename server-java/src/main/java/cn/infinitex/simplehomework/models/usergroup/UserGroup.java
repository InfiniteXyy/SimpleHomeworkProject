package cn.infinitex.simplehomework.models.usergroup;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

}
