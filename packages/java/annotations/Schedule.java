package annotations;

import java.lang.annotation.Repeatable;
import annotations.ScheduleContainer;

@Repeatable(ScheduleContainer.class)
public @interface Schedule {
  String dayOfMonth() default "first";
  String dayOfWeek() default "Mon";
  int hour() default 12;
}
