package cn.infinitex.simplehomework.models.group;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupCardRepository extends JpaRepository<GroupCard, Long> {
  List<GroupCard> findByGroupId(Long groupId);

}
