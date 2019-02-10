package cn.infinitex.simplehomework.api;

import cn.infinitex.simplehomework.api.request.NewTodoParam;
import cn.infinitex.simplehomework.api.response.TodoData;
import cn.infinitex.simplehomework.models.todo.Todo;
import cn.infinitex.simplehomework.models.todo.TodoRepository;
import cn.infinitex.simplehomework.models.todolist.TodoList;
import cn.infinitex.simplehomework.models.todolist.TodoListRepository;
import cn.infinitex.simplehomework.models.user.User;
import cn.infinitex.simplehomework.service.Auth;
import cn.infinitex.simplehomework.utils.JsonHelper;
import cn.infinitex.simplehomework.utils.ValidationHandler;
import com.fasterxml.jackson.annotation.JsonRootName;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/todo")
public class TodoApi {

  private TodoListRepository todoListRepository;
  private TodoRepository todoRepository;
  private Auth auth;

  @Autowired
  public TodoApi(TodoListRepository todoListRepository, TodoRepository todoRepository,
      Auth auth) {
    this.todoListRepository = todoListRepository;
    this.todoRepository = todoRepository;
    this.auth = auth;
  }

  private Todo findTodoById(User user, String todoId) throws Exception {
    Long id = Long.valueOf(todoId);
    Optional<Todo> todoOptional = todoRepository.findById(id);
    if (!todoOptional.isPresent()) {
      throw new Exception("todoid wrong");
    }
    Todo todo = todoOptional.get();
    if (todoListRepository.findById(todo.getListId()).get().getUserId() != user.getId()) {
      throw new Exception("todo not belongs to you");
    }
    return todo;
  }


  @PostMapping("/")
  public ResponseEntity createTodo(
      @RequestHeader(value = "Authorization") String authorization,
      @Valid @RequestBody NewTodoParam newTodoParam,
      BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      return ResponseEntity.status(422).body(ValidationHandler.serialize(bindingResult));
    }
    try {
      User user = auth.authorize(authorization);
      Optional<TodoList> todoList = todoListRepository.findById(newTodoParam.getListId());
      if (!todoList.isPresent()) {
        throw new Exception("wrong list id");
      } else {
        if (todoList.get().getUserId() != user.getId()) {
          throw new Exception("list doesn't belongs to you");
        }
      }
      Todo todo = new Todo(
          newTodoParam.getListId(),
          newTodoParam.getContent(),
          newTodoParam.getDeadlineAt(),
          newTodoParam.getNoticeAt(),
          newTodoParam.getImageUrl(),
          newTodoParam.getRemarks());
      todoRepository.save(todo);
      return ResponseEntity.ok(new TodoData(todo).getJson());
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }

  @PostMapping("/{todoId}")
  public ResponseEntity toggleTodoStatus(
      @RequestHeader(value = "Authorization") String authorization,
      @PathVariable String todoId,
      @RequestParam(value = "type") boolean type) {
    try {
      User user = auth.authorize(authorization);
      Todo todo = findTodoById(user, todoId);
      todo.setFinished(type);
      todoRepository.save(todo);
      return ResponseEntity.ok(new TodoData(todo).getJson());
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }

  @DeleteMapping("/{todoId}")
  public ResponseEntity deleteTodo(
      @RequestHeader(value = "Authorization") String authorization,
      @PathVariable String todoId
  ) {
    try {
      User user = auth.authorize(authorization);
      Todo todo = findTodoById(user, todoId);
      todoRepository.delete(todo);
      return ResponseEntity.ok("deleted");
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }

  @PutMapping("/{todoId}")
  public ResponseEntity updateTodo(
      @RequestHeader(value = "Authorization") String authorization,
      @PathVariable String todoId,
      @RequestBody UpdateTodoParam todoParam
  ) {
    try {
      User user = auth.authorize(authorization);
      Todo todo = findTodoById(user, todoId);

      if (!todoListRepository.findById(todoParam.getListId()).isPresent()
          && todoParam.getListId() != 0
      ) {
        throw new Exception("list not exists");
      }

      todo.update(
          todoParam.getListId(),
          todoParam.getContent(),
          todoParam.getDeadlineAt(),
          todoParam.getImageUrl(),
          todoParam.getNoticeAt(),
          todoParam.getRemarks());
      todoRepository.save(todo);
      return ResponseEntity.ok(new TodoData(todo).getJson());
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }
}

@Getter
@JsonRootName("todo")
class UpdateTodoParam {

  @NotBlank
  private String content = "";
  @Positive
  private Long listId = 0L;
  private String deadlineAt = "";
  private String noticeAt = "";
  private String imageUrl = "";
  private String remarks = "";
}
