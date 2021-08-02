package jkf;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.Locale;
import java.time.Month; // enums
import java.time.format.TextStyle;
import java.time.YearMonth;
import java.time.MonthDay;
import java.time.Year;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.time.Instant;
import java.time.ZoneId;
import java.time.LocalDateTime;

public class App {

    final static String NS = System.getProperty("line.separator");
    final static String CWD = System.getProperty("user.dir");

    static void println(String fmt, Object... args) {
        System.out.format(fmt + "%n", args);
    }

    public App() {

    }

    public void localTimeFn() {
        var locale = Locale.getDefault();
        var today = LocalDate.now();
        var payday = today.with(TemporalAdjusters.lastDayOfMonth()).minusDays(2);
        App.println("today:%s", today);
        App.println("payday:%s", payday);

        LocalDate dateOfBirth = LocalDate.of(2012, Month.MAY, 14);
        LocalDate firstBirthday = dateOfBirth.plusDays(1);

        App.println("dob:%s", dateOfBirth);
        App.println("firstB:%s", firstBirthday);

    }

    public void dowAndMonthEnums() {
        var dow = DayOfWeek.MONDAY;
        var locale = Locale.getDefault();
        App.println("%s", dow.getDisplayName(TextStyle.FULL, locale));
        App.println("%s", dow.getDisplayName(TextStyle.NARROW, locale));
        App.println("%s", dow.getDisplayName(TextStyle.SHORT, locale));
        var maxJulyDays = Month.JULY.maxLength(); // maximum of days in July
        var minJulyDays = Month.JULY.minLength();
        App.println("Days in this JULY: (%d,%d)", minJulyDays, maxJulyDays);

        var month = Month.NOVEMBER;

        App.println("%s", month.getDisplayName(TextStyle.FULL, locale));
        App.println("%s", month.getDisplayName(TextStyle.NARROW, locale));
        App.println("%s", month.getDisplayName(TextStyle.SHORT, locale));
        App.println("%s", month.getDisplayName(TextStyle.FULL_STANDALONE, locale));
    }

    public void dateArthimatic() {
        LocalDate date = LocalDate.of(2021, 1, 20);
        App.println("date:%s", date);
        LocalDate.of(2012, Month.JULY, 9);

        var date2 = LocalDate.of(2021, Month.AUGUST, 1);
        var adj = TemporalAdjusters.firstInMonth(DayOfWeek.SUNDAY);
        var firstMon = date2.with(adj);
        App.println("first %s is on:%s", DayOfWeek.SUNDAY, firstMon);
        //
        var date3 = YearMonth.now();
        System.out.printf("%s: %d%n", date3, date3.lengthOfMonth());
        //
        YearMonth date4 = YearMonth.of(2013, Month.FEBRUARY);
        System.out.printf("%s: %d%n", date4, date4.lengthOfMonth());

        // Interesting
        var date5 = MonthDay.of(Month.FEBRUARY, 28);
        var validLeapYear = date5.isValidYear(2009);

        //
        App.println("february :%s, validLeapYear:%b", date5, validLeapYear);
        //
        var year = 2012;
        //
        var validLeapYear2 = Year.of(year).isLeap();
        App.println("isValid leap Year (%s):%b", year, validLeapYear2);
    }

    public void dateAndDateClasses() {
        LocalTime thisSec;
        thisSec = LocalTime.now();
        // implementation of display code is left to the reader
        App.println("hour:%d, minute:%d, sec:%d", thisSec.getHour(), thisSec.getMinute(), thisSec.getSecond());
    }

    public void localDateTime() {
        App.println("now: %s", LocalDateTime.now());
        App.println(
                  "Apr 15, 1994 @ 11:30am: %s",
                  LocalDateTime.of(1994, Month.APRIL, 15, 11, 30)
        );
        System.out.printf("now (from Instant): %s%n",
                  LocalDateTime.ofInstant(Instant.now(), ZoneId.systemDefault()));
        
        
        var thisSec3 = LocalTime.now();
        // implementation of display code is left to the reader
        App.println("hour:%d, minute:%d, sec:%d", thisSec3.getHour(), thisSec3.getMinute(), thisSec3.getSecond());
        App.println("6 months ago: %s", LocalDateTime.now().minusMonths(6));
        
    }

    public static void main(String... argv) throws IOException, InterruptedException {
        var app = new App();
        app.localTimeFn();
        app.dowAndMonthEnums();
        app.dateArthimatic();
        app.dateAndDateClasses();
        app.localDateTime();
    }
}
