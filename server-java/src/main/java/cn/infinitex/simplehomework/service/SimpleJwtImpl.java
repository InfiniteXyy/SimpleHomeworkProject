package cn.infinitex.simplehomework.service;

import cn.infinitex.simplehomework.models.user.JwtService;
import cn.infinitex.simplehomework.models.user.User;
import cn.infinitex.simplehomework.utils.Encrypt;
import org.springframework.stereotype.Service;

/**
 * @author xuyiyang
 */
@Service
public class SimpleJwtImpl implements JwtService {

  private String initVector = "Bar12345Bar12345";
  private String key = "tokentokentokenx";

  @Override
  public String toToken(User user) {
    String value = String.valueOf(user.getId());
    return Encrypt.encrypt(key, initVector, value);
  }

  @Override
  public String toValue(String token) {
    return Encrypt.decrypt(key, initVector, token);
  }
}
