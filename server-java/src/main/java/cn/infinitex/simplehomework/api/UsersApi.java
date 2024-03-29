package cn.infinitex.simplehomework.api;


import cn.infinitex.simplehomework.api.request.LoginParam;
import cn.infinitex.simplehomework.api.request.RegisterParam;
import cn.infinitex.simplehomework.api.response.AuthorizedUserData;
import cn.infinitex.simplehomework.models.user.EncryptService;
import cn.infinitex.simplehomework.models.user.JwtService;
import cn.infinitex.simplehomework.models.user.User;
import cn.infinitex.simplehomework.models.user.UserRepository;
import cn.infinitex.simplehomework.utils.JsonHelper;
import cn.infinitex.simplehomework.utils.ValidationHandler;
import java.util.Optional;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author xuyiyang
 */
@RestController
@RequestMapping("api/users")
public class UsersApi {

  private UserRepository userRepository;
  private EncryptService encryptService;
  private JwtService jwtService;

  @Autowired
  public UsersApi(
      UserRepository userRepository,
      EncryptService encryptService,
      JwtService jwtService) {
    this.userRepository = userRepository;
    this.encryptService = encryptService;
    this.jwtService = jwtService;
  }

  @RequestMapping(method = RequestMethod.POST)
  public ResponseEntity userRegister(@Valid @RequestBody RegisterParam registerParam,
      BindingResult bindingResult) {

    // 若格式错误则直接返回422
    if (bindingResult.hasErrors()) {
      return ResponseEntity.status(422).body(ValidationHandler.serialize(bindingResult));
    }

    Optional<User> optionalUser = userRepository.findByEmail(registerParam.getEmail());
    Optional<User> optionalUserByUsername = userRepository.findByUsername(registerParam.getUsername());
    if (optionalUser.isPresent()) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("email", "has been used")));
    } else if (optionalUserByUsername.isPresent()) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("username", "has been used")));
    } else {
      // 若没有该邮箱，且没有同样的用户名，则注册成功
      User user = new User(
          registerParam.getEmail(),
          registerParam.getUsername(),
          encryptService.encrypt(registerParam.getPassword()),
          "");
      userRepository.save(user);
      return ResponseEntity
          .ok(new AuthorizedUserData(user, jwtService.toToken(user)).getUserData());

    }
  }

  @RequestMapping(path = "/login", method = RequestMethod.POST)
  public ResponseEntity userLogin(@Valid @RequestBody LoginParam loginParam,
      BindingResult bindingResult) {
    // 若格式错误则直接返回422
    if (bindingResult.hasErrors()) {
      return ResponseEntity.status(422).body(ValidationHandler.serialize(bindingResult));
    }

    // 查看数据库中是否有该用户邮箱
    Optional<User> optionalUser = userRepository.findByEmail(loginParam.getEmail());
    if (optionalUser.isPresent() && encryptService
        .check(loginParam.getPassword(), optionalUser.get().getPassword())) {
      User user = optionalUser.get();
      // 得到该用户
      return ResponseEntity
          .ok(new AuthorizedUserData(user, jwtService.toToken(user)).getUserData());
    } else {
      // 密码或邮箱错误
      return ResponseEntity.status(401).body(
          ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", "wrong email or password")));
    }
  }
}

