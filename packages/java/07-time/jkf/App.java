package jkf;

import java.io.IOException;
import java.time.DateTimeException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjuster;
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
import java.time.ZoneOffset;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.time.format.DateTimeFormatter;
import java.time.ZonedDateTime;
import java.time.OffsetDateTime;
import java.time.OffsetTime;
import java.time.Instant;

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

    public void timeZones(){

        var allZones = ZoneId.getAvailableZoneIds(); // returns set, nothing we can do about it
        var zoneList = new ArrayList<String>(allZones);
        Collections.sort(zoneList);
        var dt = LocalDateTime.now();

        for (var zoneStr: zoneList){
            ZoneId zone = ZoneId.of(zoneStr);
            var zdt = dt.atZone(zone);
            var offset = zdt.getOffset();
            var seconds = offset.getTotalSeconds();
            var hourSec = seconds % 3600;
            if (hourSec != 0 || zoneStr.startsWith("America/Caracas")) {
                App.println("zoneStr:%-30s%-10shours%15s sec", zoneStr, offset, seconds);    
            }
        }
    }

    public void flightTime(){
        var format = DateTimeFormatter.ofPattern("MMM dd yyyy  hh:mm a");
        // Leaving from San Francisco on July 20, 2013, at 7:30 p.m.
        var leaving = LocalDateTime.of(2013, Month.JULY, 20, 19, 30);
        var leavingZone = ZoneId.of("America/Los_Angeles");
        var departure = ZonedDateTime.of(leaving, leavingZone);
        try {
            var leaveMessage = departure.format(format);
            App.println("LEAVING: %s (%s)", leaveMessage, leavingZone);
        }
        catch(DateTimeException dte){
            App.println("Error(date.format) for date (departure): %s, format:%s", departure, format);
        }

        //Flight is 10 hours and 50 minutes, or 650 minutes
        var arrivingZone = ZoneId.of("Asia/Tokyo");
        var arrival = departure // departure
                        .withZoneSameInstant(arrivingZone) //arrival zimezone
                        .plusMinutes(650); // add travel time
        try {
            var arrivalMessage = arrival.format(format);
            App.println("ARRIVING: %s (%s)", arrivalMessage, arrivingZone);
        }
        catch(DateTimeException dte){
            App.println("Error(date.format) for date (arrival) : %s, format:%s", arrival, format);
        }
    }

    public void offSetDateTimes(){
        var format = DateTimeFormatter.ISO_DATE_TIME;

        //App.println("%s", format);
        
        // Find the last Thursday in July 2013.
        var localDate = LocalDateTime.of(2013, Month.JULY, 20, 19, 30);
        App.println("%s", localDate.format(format));
        var offset = ZoneOffset.of("-08:00");
        App.println("%s", offset);
        var offsetDate = OffsetDateTime.of(localDate, offset);
        App.println("%s", offsetDate.format(format));
        var lastThursday = offsetDate.with(TemporalAdjusters.lastInMonth(DayOfWeek.THURSDAY));
        App.println("%s", lastThursday);
    }

    public void offSetTimes(){
        var format = DateTimeFormatter.ofPattern("hh:mm:ss a");

       // App.println("%s", format);
        
        // Find the last Thursday in July 2013.
        var localTime = LocalTime.now();
        App.println("%s", localTime.format(format));
        var offset = ZoneOffset.of("-08:00");
        App.println("%s", offset);
        var offsetTime = OffsetTime.of(localTime, offset);
        App.println("%s", offsetTime.format(format));
        App.println("%s", localTime.toEpochSecond(LocalDate.now(),  ZoneOffset.of("+00:00")));
        App.println("%s", localTime.toEpochSecond(LocalDate.now(), offset));
        //var lastThursday = offsetDate.with(TemporalAdjusters.lastInMonth(DayOfWeek.THURSDAY));
        //App.println("%s", lastThursday);
    }

    public void instantTime(){
        var instant = Instant.now();
        App.println("%s", instant);
        var instant2 = Instant.ofEpochSecond(0L);
        App.println("%s", instant2);
        var seconds = instant2.until(instant, ChronoUnit.SECONDS);
        App.println("%s", seconds);
        App.println("tz:%s", ZoneId.systemDefault());
    }

    public static void main(String... argv) throws IOException, InterruptedException {
        var app = new App();
        app.localTimeFn();
        app.dowAndMonthEnums();
        app.dateArthimatic();
        app.dateAndDateClasses();
        app.localDateTime();
        app.timeZones();
        app.flightTime();
        app.offSetDateTimes();
        App.println("offset_times====");
        app.offSetTimes();
        app.instantTime();

    }
}
