package cn.infinitex.simplehomework.models.group;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Group, Long> {
  Optional<Group> findByNameId(String nameId);

}
