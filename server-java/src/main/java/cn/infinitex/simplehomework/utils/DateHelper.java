package cn.infinitex.simplehomework.utils;

import org.joda.time.DateTime;
import org.joda.time.LocalDate;

public class DateHelper {

  public static Pair<DateTime> getDateRange(DateTime now) {
    LocalDate today = now.toLocalDate();
    LocalDate tomorrow = today.plusDays(1);

    DateTime startOfToday = today.toDateTimeAtStartOfDay(now.getZone());
    DateTime startOfTomorrow = tomorrow.toDateTimeAtStartOfDay(now.getZone());

    return new Pair<>(startOfToday, startOfTomorrow);
  }

}
