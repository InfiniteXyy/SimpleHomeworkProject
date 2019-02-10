package cn.infinitex.simplehomework.api.request;


import com.fasterxml.jackson.annotation.JsonRootName;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import lombok.Getter;

@JsonRootName("todo")
@Getter
public class NewTodoParam {

  @NotBlank(message = "should not be empty")
  private String content;

  @Positive(message = "should not be number")
  private Long listId;

  private String deadlineAt = "";
  private String noticeAt = "";
  private String imageUrl = "";
  private String remarks = "";


}
