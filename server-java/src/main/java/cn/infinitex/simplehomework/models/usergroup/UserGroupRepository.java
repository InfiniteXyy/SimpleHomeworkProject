package cn.infinitex.simplehomework.models.usergroup;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserGroupRepository extends JpaRepository<UserGroup, Long> {

  Optional<UserGroup> findByUserIdAndGroupId(long userId, long groupId);

  List<UserGroup> findByUserId(long userId);

  @Query("select userId from UserGroup where groupId = ?1")
  List<Long> findUserIdsByGroupId(long groupId);

  List<UserGroup> findByGroupId(long groupId);

}
