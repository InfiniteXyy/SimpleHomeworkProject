package cn.infinitex.simplehomework.models.message;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * @author xuyiyang
 */
public interface MessageRepository extends JpaRepository<Message, Long> {

  @Query(
      value = "SELECT * from message where group_id in ?1 and created_at < ?3 order by created_at DESC LIMIT ?2",
      nativeQuery = true)
  List<Message> findTopMessagesSince(List<Long> groupIds, int limit, String from);

  @Query(value = "SELECT * from message where group_id in ?1 order by created_at DESC LIMIT ?2", nativeQuery = true)
  List<Message> findTopMessages(List<Long> groupIds, int limit);

  @Query(value = "SELECT * from message where group_id = ?1 order by created_at DESC LIMIT ?2", nativeQuery = true)
  List<Message> findTopMessagesByGroupIdSince(long groupId, int limit, String from);


  @Query(value = "SELECT * from message where group_id = ?1 order by created_at DESC LIMIT ?2", nativeQuery = true)
  List<Message> findTopMessagesByGroupId(long groupId, int limit);
}
