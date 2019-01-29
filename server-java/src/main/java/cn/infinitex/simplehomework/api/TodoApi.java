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
import java.util.Optional;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/todo/")
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


  @RequestMapping(method = RequestMethod.POST)
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
      Todo todo = new Todo(newTodoParam.getListId(), newTodoParam.getContent(),
          newTodoParam.getDeadlineAt(), newTodoParam.getNoticeAt(), newTodoParam.getImageUrl());
      todoRepository.save(todo);
      return ResponseEntity.ok(new TodoData(todo).getJson());
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }


}
