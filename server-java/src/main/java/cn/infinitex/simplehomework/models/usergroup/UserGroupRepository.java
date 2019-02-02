package cn.infinitex.simplehomework.models.usergroup;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserGroupRepository extends JpaRepository<UserGroup, Long> {

  Optional<UserGroup> findByUserIdAndGroupId(long userId, long groupId);

  List<UserGroup> findByUserId(long userId);

}
