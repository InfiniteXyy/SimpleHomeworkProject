package cn.infinitex.simplehomework.models.chat;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BubbleRepository extends JpaRepository<Bubble, Long> {

  List<Bubble> findBubblesByUserIdOrDestUserId(Long userId, Long destId);

}
