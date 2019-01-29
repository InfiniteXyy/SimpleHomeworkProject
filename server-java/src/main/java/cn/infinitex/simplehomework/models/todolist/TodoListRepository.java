package cn.infinitex.simplehomework.models.todolist;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoListRepository extends JpaRepository<TodoList, Long> {

  public List<TodoList> findAllByUserIdIs(long userId);

}
