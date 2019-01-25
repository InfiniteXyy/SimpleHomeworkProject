package cn.infinitex.simplehomework.service;

import static org.junit.Assert.assertEquals;

import cn.infinitex.simplehomework.models.user.User;
import org.junit.Before;
import org.junit.Test;

public class SimpleJwtImplTest {

  private SimpleJwtImpl jwtService;

  private User user;

  @Before
  public void setUp() {
    jwtService = new SimpleJwtImpl();
    user = new User("xyy@xyy.x", "xyy", "123", "");
  }

  @Test
  public void should_token_return_correct() throws Exception {
    String token = jwtService.toToken(user);

    String value = jwtService.toValue(token);

    assertEquals(String.valueOf(user.getId()), value);

  }
}