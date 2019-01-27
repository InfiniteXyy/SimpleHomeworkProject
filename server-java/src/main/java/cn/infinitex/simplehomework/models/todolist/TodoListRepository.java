package cn.infinitex.simplehomework.models.todolist;

import cn.infinitex.simplehomework.models.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoListRepository extends JpaRepository<TodoList, Long> {

}
