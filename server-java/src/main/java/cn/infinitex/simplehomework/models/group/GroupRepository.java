package cn.infinitex.simplehomework.models.group;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Group, Long> {

  Optional<Group> findByNameId(String nameId);

  List<Group> findByIdIn(List<Long> ids);

  List<Group> findAllByCreatorId(long id);

  List<Group> findByTitleIgnoreCaseContaining(String title);


}
