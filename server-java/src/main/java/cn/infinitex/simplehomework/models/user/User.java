package cn.infinitex.simplehomework.models.user;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * @author xuyiyang
 */
@Table(name = "\"user\"")
@Entity
@Getter
@NoArgsConstructor
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  private String email;
  private String username;
  private String password;
  private String image;


  public User(String email, String username, String password, String image) {
    this.email = email;
    this.username = username;
    this.password = password;
    this.image = image;
  }

  public void update(String email, String username, String password, String image) {
    if (!"".equals(email)) {
      this.email = email;
    }
    if (!"".equals(username)) {
      this.username = username;
    }
    if (!"".equals(password)) {
      this.password = password;
    }
    if (!"".equals(image)) {
      this.image = image;
    }
  }

}
