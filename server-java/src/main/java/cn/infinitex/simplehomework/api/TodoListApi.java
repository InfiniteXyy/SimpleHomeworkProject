package cn.infinitex.simplehomework.api;

import cn.infinitex.simplehomework.api.request.NewTodoListParam;
import cn.infinitex.simplehomework.api.response.TodoListData;
import cn.infinitex.simplehomework.models.todo.TodoRepository;
import cn.infinitex.simplehomework.models.todolist.TodoList;
import cn.infinitex.simplehomework.models.todolist.TodoListRepository;
import cn.infinitex.simplehomework.models.user.User;
import cn.infinitex.simplehomework.service.Auth;
import cn.infinitex.simplehomework.utils.JsonHelper;
import cn.infinitex.simplehomework.utils.ValidationHandler;
import java.util.ArrayList;
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
@RequestMapping("api/todolist/")
public class TodoListApi {

  private TodoListRepository todoListRepository;
  private TodoRepository todoRepository;
  private Auth auth;

  @Autowired
  public TodoListApi(TodoListRepository todoListRepository, TodoRepository todoRepository,
      Auth auth) {
    this.todoListRepository = todoListRepository;
    this.todoRepository = todoRepository;
    this.auth = auth;
  }


  @RequestMapping(method = RequestMethod.POST)
  public ResponseEntity createTodoList(
      @RequestHeader(value = "Authorization") String authorization,
      @Valid @RequestBody NewTodoListParam newTodoListParam,
      BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      return ResponseEntity.status(422).body(ValidationHandler.serialize(bindingResult));
    }
    try {
      User user = auth.authorize(authorization);

      TodoList todoList = new TodoList(user.getId(), newTodoListParam.getTitle());
      todoListRepository.save(todoList);
      return ResponseEntity.ok(new TodoListData(todoList, new ArrayList<>()).getJson());

    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("token", "unauthorized")));
    }
  }


  @RequestMapping(method = RequestMethod.GET)
  public ResponseEntity getTodoLists(@RequestHeader(value = "Authorization") String authorization) {
    try {
      User user = auth.authorize(authorization);
      return ResponseEntity
          .ok(JsonHelper.object("lists", todoListRepository
              .findAllByUserIdIs(user.getId())
              .stream()
              .map((item) -> new TodoListData(item,
                  todoRepository.findAllByListIdIs(item.getId())).getData())));
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("token", "unauthorized")));
    }
  }


}
