package cn.infinitex.simplehomework.models.card;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardLogRepository extends JpaRepository<CardLog, Long> {

  List<CardLog> findByCardIdInAndCheckTimeBetween(List<Long> cardIds, String from, String to);

}
