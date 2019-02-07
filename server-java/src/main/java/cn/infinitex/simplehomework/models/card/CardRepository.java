package cn.infinitex.simplehomework.models.card;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Card, Long> {
  public List<Card> findByUserId(Long userId);

}
