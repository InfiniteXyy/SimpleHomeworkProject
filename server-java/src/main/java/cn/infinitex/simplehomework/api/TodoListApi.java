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
import com.fasterxml.jackson.annotation.JsonRootName;
import java.util.ArrayList;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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

  private TodoList findAuthorizedById(User user, long listId) throws Exception {
    Optional<TodoList> todoListOptional = todoListRepository.findById(listId);
    if (!todoListOptional.isPresent()) {
      throw new Exception("wrong id");
    }
    TodoList todoList = todoListOptional.get();
    if (todoList.getUserId() != user.getId()) {
      throw new Exception("not validated");
    }
    return todoList;
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
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
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

  @RequestMapping(method = RequestMethod.PUT, value = "{listId}")
  public ResponseEntity updateTodoList(
      @RequestHeader(value = "Authorization") String authorization,
      @Valid @RequestBody UpdateTodoListParam updateTodoListParam,
      @PathVariable long listId,
      BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      return ResponseEntity.status(422).body(ValidationHandler.serialize(bindingResult));
    }
    try {
      User user = auth.authorize(authorization);
      TodoList todoList = findAuthorizedById(user, listId);
      todoList.update(updateTodoListParam.getTitle());
      todoListRepository.save(todoList);
      return ResponseEntity.ok(
          new TodoListData(todoList, todoRepository.findAllByListIdIs(listId)).getJson());
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }


  @RequestMapping(method = RequestMethod.DELETE, value = "{listId}")
  public ResponseEntity deleteTodoList(
      @RequestHeader(value = "Authorization") String authorization,
      @PathVariable long listId) {
    try {
      User user = auth.authorize(authorization);
      todoListRepository.delete(findAuthorizedById(user, listId));
      return ResponseEntity.ok("deleted");
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }

  @RequestMapping(method = RequestMethod.POST, value = "{listId}")
  public ResponseEntity archiveTodoList(
      @RequestHeader(value = "Authorization") String authorization,
      @RequestParam boolean archived,
      @PathVariable long listId) {
    try {
      User user = auth.authorize(authorization);
      TodoList todoList = findAuthorizedById(user, listId);
      todoList.toggle(archived);
      todoListRepository.save(todoList);
      return ResponseEntity.ok(JsonHelper.object("archived", archived));
    } catch (Exception e) {
      return ResponseEntity.status(401)
          .body(ValidationHandler.wrapErrorRoot(JsonHelper.object("validation", e.getMessage())));
    }
  }


}

@Getter
@JsonRootName("list")
class UpdateTodoListParam {

  @NotBlank
  private String title;
}


