package cn.infinitex.simplehomework.api;

import cn.infinitex.simplehomework.api.response.BubbleData;
import cn.infinitex.simplehomework.models.chat.Bubble;
import cn.infinitex.simplehomework.models.chat.BubbleRepository;
import cn.infinitex.simplehomework.models.user.User;
import cn.infinitex.simplehomework.models.user.UserRepository;
import cn.infinitex.simplehomework.service.Auth;
import cn.infinitex.simplehomework.utils.JsonHelper;
import cn.infinitex.simplehomework.utils.ValidationHandler;
import com.fasterxml.jackson.annotation.JsonRootName;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/chat")
public class ChatApi {

  private Auth auth;
  private BubbleRepository bubbleRepository;
  private UserRepository userRepository;

  @Autowired
  public ChatApi(Auth auth, BubbleRepository bubbleRepository,
      UserRepository userRepository) {
    this.auth = auth;
    this.bubbleRepository = bubbleRepository;
    this.userRepository = userRepository;
  }

  @PostMapping("/")
  public ResponseEntity sendBubble(
      @RequestHeader(value = "Authorization") String authorization,
      @Valid @RequestBody NewBubbleParam newBubble,
      BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      return ResponseEntity.status(422).body(ValidationHandler.serialize(bindingResult));
    }
    try {
      User user = auth.authorize(authorization);
      Optional<User> destOptional = userRepository.findByUsername(newBubble.getDestUsername());
      if (!destOptional.isPresent()) {
        throw new Exception("dest not exsit");
      }
      Bubble bubble = new Bubble(
          user.getId(),
          user.getUsername(),
          destOptional.get().getUsername(),
          destOptional.get().getId(),
          newBubble.getContent()
      );
      bubbleRepository.save(bubble);
      return ResponseEntity.ok(new BubbleData(bubble).getJson());
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }

  @GetMapping("/")
  public ResponseEntity getBubbles(
      @RequestHeader(value = "Authorization") String authorization
  ) {
    try {
      User user = auth.authorize(authorization);
      List<Bubble> bubbles = bubbleRepository
          .findBubblesByUserIdOrDestUserId(user.getId(), user.getId());

      return ResponseEntity.ok(JsonHelper.object("bubbles", bubbles.stream()
          .map(BubbleData::new)
          .map(BubbleData::getData)
          .peek(i -> {
            if (i.get("dest").equals(user.getUsername())) {
              i.put("type", "reply");
              i.put("avatar",
                  userRepository.findByUsername((String) i.get("from")).get().getImage());
            } else {
              i.put("type", "send");
              i.put("avatar",
                  userRepository.findByUsername((String) i.get("dest")).get().getImage());
            }
          })
          .collect(Collectors.toList())
      ));
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }


}


@Getter
@JsonRootName("bubble")
class NewBubbleParam {

  @NotBlank
  private String content;
  private String destUsername;
}