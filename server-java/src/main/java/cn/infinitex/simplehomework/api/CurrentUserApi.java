package cn.infinitex.simplehomework.api;

import cn.infinitex.simplehomework.api.request.UpdateUserParam;
import cn.infinitex.simplehomework.api.response.AuthorizedUserData;
import cn.infinitex.simplehomework.models.user.EncryptService;
import cn.infinitex.simplehomework.models.user.User;
import cn.infinitex.simplehomework.models.user.UserRepository;
import cn.infinitex.simplehomework.service.Auth;
import cn.infinitex.simplehomework.utils.JsonHelper;
import cn.infinitex.simplehomework.utils.ValidationHandler;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author xuyiyang
 */
@RestController
@RequestMapping("api/user")
public class CurrentUserApi {

  private UserRepository userRepository;
  private EncryptService encryptService;
  private Auth auth;

  @Autowired
  public CurrentUserApi(
      UserRepository userRepository,
      EncryptService encryptService,
      Auth auth) {
    this.userRepository = userRepository;
    this.encryptService = encryptService;
    this.auth = auth;
  }

  @RequestMapping(method = RequestMethod.GET)
  public ResponseEntity currentUser(@RequestHeader(value = "Authorization") String authorization) {
    try {
      User user = auth.authorize(authorization);
      return ResponseEntity.ok(new AuthorizedUserData(
          user,
          authorization.split(" ")[1]).getUserData());
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("token", "unauthorized")));
    }
  }

  @RequestMapping(method = RequestMethod.PUT)
  public ResponseEntity updateCurrentUser(
      @RequestHeader(value = "Authorization") String authorization,
      @Valid @RequestBody UpdateUserParam updateUserParam,
      BindingResult bindingResult) {
    // 若格式错误则直接返回422
    if (bindingResult.hasErrors()) {
      return ResponseEntity.status(422).body(ValidationHandler.serialize(bindingResult));
    }
    try {
      User user = auth.authorize(authorization);
      user.update(
          updateUserParam.getEmail(),
          updateUserParam.getUsername(),
          encryptService.encrypt(updateUserParam.getPassword()),
          updateUserParam.getImage());
      userRepository.save(user);
      return ResponseEntity.ok(new AuthorizedUserData(user,
          authorization.split(" ")[1]).getUserData());
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("token", "unauthorized")));
    }
  }
}

