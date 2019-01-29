package cn.infinitex.simplehomework.models.todo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {
  List<Todo> findAllByListIdIs(long listId);

}

