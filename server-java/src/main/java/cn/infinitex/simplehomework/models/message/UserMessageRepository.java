package cn.infinitex.simplehomework.models.message;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserMessageRepository extends JpaRepository<UserMessage, Long> {

  Optional<UserMessage> findByUserIdAndMessageId(Long userId, Long messageId);

  @Query(value = "SELECT * from user_message where user_id = ?1 and is_like = true", nativeQuery = true)
  List<UserMessage> findByUserIdAndLikeIsTrue(Long userId);

}
