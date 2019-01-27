package cn.infinitex.simplehomework.api;

import cn.infinitex.simplehomework.api.request.NewTodoListParam;
import cn.infinitex.simplehomework.api.response.TodoListData;
import cn.infinitex.simplehomework.models.todolist.TodoList;
import cn.infinitex.simplehomework.models.todolist.TodoListRepository;
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

@RestController
@RequestMapping("api/todolist/")
public class TodoListApi {

  private TodoListRepository todoListRepository;
  private UserRepository userRepository;
  private Auth auth;

  @Autowired
  public TodoListApi(TodoListRepository todoListRepository, UserRepository userRepository,
      Auth auth) {
    this.todoListRepository = todoListRepository;
    this.userRepository = userRepository;
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
      // 一个简单的增加基本上只要改这点，其它都一样就行
      // *** start ***
      TodoList todoList = new TodoList(user.getId(), newTodoListParam.getTitle());
      todoListRepository.save(todoList);
      return ResponseEntity.ok(new TodoListData(todoList).getJson());
      // *** end ***
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("token", "unauthorized")));
    }
  }


}
