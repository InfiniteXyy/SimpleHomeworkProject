package cn.infinitex.simplehomework.api.request;

import com.fasterxml.jackson.annotation.JsonRootName;
import javax.validation.constraints.NotBlank;
import lombok.Getter;

@JsonRootName("list")
@Getter
public class NewTodoListParam {
  @NotBlank(message = "should not be empty")
  private String title;
}
