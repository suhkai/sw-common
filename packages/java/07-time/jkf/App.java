package jkf;

import java.io.IOException;

import java.time.DateTimeException;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.Month;

import java.time.format.TextStyle;
import java.time.YearMonth;
import java.time.MonthDay;
import java.time.Year;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;

import java.util.Collections;
import java.util.ArrayList;
import java.util.Locale;

import java.time.format.DateTimeFormatter;
import java.time.ZonedDateTime;
import java.time.OffsetDateTime;
import java.time.OffsetTime;
import java.time.temporal.IsoFields;

import java.time.temporal.TemporalQuery;
import java.time.temporal.Temporal;
import java.time.temporal.TemporalAccessor;
import java.time.temporal.TemporalUnit;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.TemporalQueries;

import java.time.Period;

import java.time.chrono.JapaneseDate;
import java.time.chrono.HijrahDate;
import java.time.chrono.MinguoDate;
import java.time.chrono.ThaiBuddhistDate;
import java.time.chrono.Chronology;
import java.time.chrono.ChronoLocalDate;
import java.time.chrono.IsoChronology;
import java.time.chrono.JapaneseChronology;
import java.time.format.DecimalStyle;
import java.time.format.FormatStyle;

import java.util.function.BiFunction;

import java.time.format.DateTimeFormatterBuilder;

// Returns true if the passed-in date is the same as one of the
// family birthdays. Because the query compares the month and day only,
// the check succeeds even if the Temporal types are not the same.
class FamilyBirthDays implements TemporalQuery<Boolean> {
    public Boolean queryFrom(TemporalAccessor date) {
        int month = date.get(ChronoField.MONTH_OF_YEAR);
        int day = date.get(ChronoField.DAY_OF_MONTH);

        // Angie's birthday is on April 3.
        if ((month == Month.APRIL.getValue()) && (day == 3))
            return Boolean.TRUE;

        // Sue's birthday is on June 18.
        if ((month == Month.JUNE.getValue()) && (day == 18))
            return Boolean.TRUE;

        // Joe's birthday is on May 29.
        if ((month == Month.MAY.getValue()) && (day == 29))
            return Boolean.TRUE;

        return Boolean.FALSE;
    }
}

class FamilyVacations implements TemporalQuery<Boolean> {

    // Returns true if the passed-in date occurs during one of the
    // family vacations. Because the query compares the month and day only,
    // the check succeeds even if the Temporal types are not the same.
    public Boolean queryFrom(TemporalAccessor date) {
        int month = date.get(ChronoField.MONTH_OF_YEAR);
        int day = date.get(ChronoField.DAY_OF_MONTH);

        int aug = Month.AUGUST.getValue();
        int april = Month.AUGUST.getValue();

        // Disneyland over Spring Break
        if ((month == april) && ((day >= 3) && (day <= 8)))
            return Boolean.TRUE;

        // Smith family reunion on Lake Saugatuck
        if ((month == aug) && ((day >= 8) && (day <= 14)))
            return Boolean.TRUE;

        return Boolean.FALSE;
    }
}

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

    public void dateArithmetic() {
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
        App.println("Apr 15, 1994 @ 11:30am: %s", LocalDateTime.of(1994, Month.APRIL, 15, 11, 30));
        System.out.printf("now (from Instant): %s%n", LocalDateTime.ofInstant(Instant.now(), ZoneId.systemDefault()));

        var thisSec3 = LocalTime.now();
        // implementation of display code is left to the reader
        App.println("hour:%d, minute:%d, sec:%d", thisSec3.getHour(), thisSec3.getMinute(), thisSec3.getSecond());
        App.println("6 months ago: %s", LocalDateTime.now().minusMonths(6));

    }

    public void timeZones() {
        var allZones = ZoneId.getAvailableZoneIds(); // returns set, nothing we can do about it
        var zoneList = new ArrayList<String>(allZones);
        Collections.sort(zoneList);
        var dt = LocalDateTime.now();

        for (var zoneStr : zoneList) {
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

    public void flightTime() {
        var format = DateTimeFormatter.ofPattern("MMM dd yyyy  hh:mm a");
        // Leaving from San Francisco on July 20, 2013, at 7:30 p.m.
        var leaving = LocalDateTime.of(2013, Month.JULY, 20, 19, 30);
        var leavingZone = ZoneId.of("America/Los_Angeles");
        var departure = ZonedDateTime.of(leaving, leavingZone);
        try {
            var leaveMessage = departure.format(format);
            App.println("LEAVING: %s (%s)", leaveMessage, leavingZone);
        } catch (DateTimeException dte) {
            App.println("Error(date.format) for date (departure): %s, format:%s", departure, format);
        }

        // Flight is 10 hours and 50 minutes, or 650 minutes
        var arrivingZone = ZoneId.of("Asia/Tokyo");
        var arrival = departure // departure
                .withZoneSameInstant(arrivingZone) // arrival zimezone
                .plusMinutes(650); // add travel time
        try {
            var arrivalMessage = arrival.format(format);
            App.println("ARRIVING: %s (%s)", arrivalMessage, arrivingZone);
        } catch (DateTimeException dte) {
            App.println("Error(date.format) for date (arrival) : %s, format:%s", arrival, format);
        }
    }

    public void offSetDateTimes() {
        var format = DateTimeFormatter.ISO_DATE_TIME;

        // App.println("%s", format);

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

    public void offSetTimes() {
        var format = DateTimeFormatter.ofPattern("hh:mm:ss a");

        // App.println("%s", format);

        // Find the last Thursday in July 2013.
        var localTime = LocalTime.now();
        App.println("%s", localTime.format(format));
        var offset = ZoneOffset.of("-08:00");
        App.println("%s", offset);
        var offsetTime = OffsetTime.of(localTime, offset);
        App.println("%s", offsetTime.format(format));
        App.println("%s", localTime.toEpochSecond(LocalDate.now(), ZoneOffset.of("+00:00")));
        App.println("%s", localTime.toEpochSecond(LocalDate.now(), offset));

        // var lastThursday =
        // offsetDate.with(TemporalAdjusters.lastInMonth(DayOfWeek.THURSDAY));
        // App.println("%s", lastThursday);
    }

    public void instantTime() {
        var instant = Instant.now();
        App.println("%s (now)", instant);
        // 1 hour later
        var oneHourLater = instant.plus(1, ChronoUnit.HOURS);
        App.println("%s (One hour later)", oneHourLater);

        var instant2 = Instant.ofEpochSecond(0L);
        App.println("%s", instant2);
        var seconds = instant2.until(instant, ChronoUnit.SECONDS);
        App.println("%s", seconds);
        App.println("tz:%s", ZoneId.systemDefault());
    }

    public void parsing() {
        var now = LocalDateTime.now();
        App.println("ISO_DATE_TIME  :%s", now.format(DateTimeFormatter.ISO_DATE_TIME));
        App.println("ISO_DATE       :%s", now.format(DateTimeFormatter.ISO_DATE));
        App.println("BASIC_ISO_DATE :%s", now.format(DateTimeFormatter.BASIC_ISO_DATE));
        var nowWithZone = ZonedDateTime.now();
        App.println("ISO_INSTANT    :%s", nowWithZone.format(DateTimeFormatter.ISO_INSTANT));
        // why doesnt this work? ZonedDateTime.parse("202108-04T22:32:14.3952584",
        // DateTimeFormatter.BASIC_ISO_DATE);
    }

    public void temporals() {
        var ld = LocalDate.now().isSupported(ChronoField.DAY_OF_MONTH);
        App.println("LocalDate as 'Day of month' support?. %s", ld);

        var quarter = LocalDate.now().isSupported(IsoFields.QUARTER_OF_YEAR);
        App.println("LocalDate as 'QUARTER_OF_YEAR' support?. %s", quarter);

        Instant instant = Instant.now();
        boolean days = instant.isSupported(ChronoUnit.DAYS);
        App.println("instant has 'DAYS' support?. %s", days);

    }

    public void temporalAdjuster() {
        // Predefined adjusters
        App.println("%n%n====Predefined adjusters====");
        var date = LocalDate.of(2021, Month.AUGUST, 5);
        var dotw = date.getDayOfWeek();
        App.println("%s is on a %s", date, dotw);
        App.println("first Day of Month:%s", date.with(TemporalAdjusters.firstDayOfMonth()));
        App.println("first Monday of Month: %s", date.with(TemporalAdjusters.firstInMonth(DayOfWeek.MONDAY)));

        {
            var dateAdj = date.with(TemporalAdjusters.lastDayOfMonth());
            App.println("last day of Month: %s on a %s", dateAdj, dateAdj.getDayOfWeek());
        }

        {
            var dateAdj = date.with(TemporalAdjusters.lastDayOfMonth()).plusDays(1);
            App.println("first day of next Month: %s on a %s", dateAdj, dateAdj.getDayOfWeek());
        }

        {
            var dateAdj = date.with(TemporalAdjusters.lastDayOfMonth());
            App.println("first day of next Month: %s on a %s", dateAdj, dateAdj.getDayOfWeek());
        }

        {
            var dateAdj = date.with(TemporalAdjusters.firstDayOfNextYear());
            App.println("first day of next Year: %s on a %s", dateAdj, dateAdj.getDayOfWeek());
        }

        {
            var dateAdj = date.with(TemporalAdjusters.firstDayOfYear()).plusDays(-1);
            App.println("first day of the Year: %s on a %s", dateAdj, dateAdj.getDayOfWeek());
        }

        {
            // pick day
            var date1 = LocalDate.from(LocalDateTime.now()); // delete time section0
            var day = (date1.getDayOfMonth() < 15) ? 15
                    : date1.with(TemporalAdjusters.lastDayOfMonth()).getDayOfMonth();
            // create date
            date1 = date1.withDayOfMonth(day);
            // adjust for weekend,
            var dow = date1.getDayOfWeek();
            // get last bizz day if it was on a weekend
            App.println("Dat of week: %s", dow);
            if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
                App.println("dow is on weekend, correcting %s", date1);
                date1 = date1.with(TemporalAdjusters.previous(DayOfWeek.FRIDAY));
            }
            App.println("final calculated: %s %s", date1, date1.getDayOfWeek());
        }
    }

    public void temporalQuery() {
        App.println("%n%n====Temporal Query====");

        var date = LocalDate.of(2021, Month.AUGUST, 5);

        var query = TemporalQueries.precision();
        App.println("LocalDate precision is: %s", LocalDate.now().query(query));
        App.println("LocalDateTime precision is %s", LocalDateTime.now().query(query));
        App.println("Year precision is %s", Year.now().query(query));
        App.println("YearMonth precision is %s", YearMonth.now().query(query));

        // queryFrom test
        var dateTime = LocalDateTime.now();
        var moy = dateTime.get(ChronoField.MONTH_OF_YEAR);
        App.println("month of year:%s", moy);

        TemporalQuery<Boolean> familyVacations = d -> {
            int month = date.get(ChronoField.MONTH_OF_YEAR);
            int day = date.get(ChronoField.DAY_OF_MONTH);

            int aug = Month.AUGUST.getValue();
            int april = Month.AUGUST.getValue();

            // Disneyland over Spring Break
            if ((month == april) && ((day >= 3) && (day <= 8)))
                return Boolean.TRUE;

            // Smith family reunion on Lake Saugatuck
            if ((month == aug) && ((day >= 8) && (day <= 14)))
                return Boolean.TRUE;

            return Boolean.FALSE;
        };

        boolean isFamilyVacation1 = date.query(new FamilyVacations());
        boolean isFamilyVacation2 = date.query(familyVacations);

        App.println("isFamilyVacations1: %b", isFamilyVacation1);
        App.println("isFamilyVacations2: %b", isFamilyVacation2);
    }

    public void periodAndDuration() {
        // Duration class uses seconds and nanoseconds
        // Period class uses Years, Months, days
        // ChronoUnit.between method

        // PS: Duration of day is normally 24h except if it happens on Timezone changes
        // (23h or 25h)

        // Duration
        // Duration
        // Duration

        var t1 = Instant.now();
        var t2 = t1.plus(1, ChronoUnit.DAYS);

        var sec = Duration.between(t1, t2).toSeconds();
        App.println("24 hour difference in seconds: %s", sec);

        var gap = Duration.ofSeconds(10);

        App.println("10 sec gap: %s (toString), %s (toSeconds)", gap, gap.toSeconds());

        App.println("24 hours later instant time:%s", t2);
        App.println("24 hours later instant time:%s", t2.plus(gap));

        // ChronoUnit

        // t2 > t1
        var gap2 = ChronoUnit.MINUTES.between(t1, t2);

        App.println("24 hours in minutes:%s", gap2);

        // Period
        var ldNow = LocalDate.now();
        var birthday = LocalDate.of(1968, Month.JULY, 22);

        var p = Period.between(birthday, ldNow);
        App.println("Period.between, years:%s, month:%s, days:%s", p.getYears(), p.getMonths(), p.getDays());
        var p2 = ChronoUnit.DAYS.between(birthday, ldNow);
        App.println("Period.between, days:%s", p2);

        // same value for "birthday"
        var thisYearBD = birthday.withYear(LocalDate.now().getYear());
        var alreadyHappened = LocalDate.now().isAfter(thisYearBD);
        App.println("your birthday %s %s", alreadyHappened ? "(next year)" : "be on",
                alreadyHappened ? thisYearBD.plusYears(1) : thisYearBD);
    }

    public void nonIsoDateConversion() {
        LocalDateTime date = LocalDateTime.of(2013, Month.JULY, 20, 19, 30);
        var jdate = JapaneseDate.from(date);
        App.println("Japanese date:%s", jdate);

        var hdate = HijrahDate.from(date);
        App.println("HijrahDate date:%s", hdate);

        var mdate = MinguoDate.from(date);
        App.println("MinguoDate date:%s", mdate);

        var tdate = ThaiBuddhistDate.from(date);
        App.println("MinguoDate date:%s", tdate);

        final BiFunction<Temporal, Chronology, String> toNonISO = (Temporal localDate, Chronology chrono) -> {
            if (localDate == null) {
                return "";
            }

            Locale locale = Locale.getDefault(Locale.Category.FORMAT);
            Temporal cDate;
            if (chrono == null) {
                chrono = IsoChronology.INSTANCE;
            }
            try {
                cDate = chrono.date(localDate);
            } catch (DateTimeException ex) {
                System.err.println(ex);
                chrono = IsoChronology.INSTANCE;
                cDate = localDate;
            }
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofLocalizedDate(FormatStyle.SHORT).withLocale(locale)
                    .withChronology(chrono).withDecimalStyle(DecimalStyle.of(locale));
            String pattern = "M/d/yyyy GGGGG";
            return dateFormatter.format(cDate);
        };

        final BiFunction<String, Chronology, Temporal> toISO = (String text, Chronology chrono) -> {
            if (text != null && !text.isEmpty()) {
                Locale locale = Locale.getDefault(Locale.Category.FORMAT);
                if (chrono == null) {
                    chrono = IsoChronology.INSTANCE;
                }
                String pattern = "M/d/yyyy GGGGG";
                DateTimeFormatter df = new DateTimeFormatterBuilder().parseLenient().appendPattern(pattern)
                        .toFormatter().withChronology(chrono).withDecimalStyle(DecimalStyle.of(locale));
                TemporalAccessor temporal = df.parse(text);
                ChronoLocalDate cDate = chrono.date(temporal);
                return LocalDate.from(cDate);
            }
            return null;
        };

        LocalDate date4 = LocalDate.of(1996, Month.OCTOBER, 29);
        App.println("towards Japanese form:%s", toNonISO.apply(date4, JapaneseChronology.INSTANCE));

        App.println("towards ISO %s", toISO.apply("10/29/0008 H", JapaneseChronology.INSTANCE));

    }

    public static void main(String... argv) throws IOException, InterruptedException {
        var app = new App();
        app.localTimeFn();
        app.dowAndMonthEnums();
        app.dateArithmetic();
        app.dateAndDateClasses();
        app.localDateTime();
        app.timeZones();
        app.flightTime();
        app.offSetDateTimes();
        App.println("offset_times====");
        app.offSetTimes();
        app.instantTime();
        app.parsing();
        app.temporals();
        app.temporalAdjuster();
        app.temporalQuery();
        app.periodAndDuration();
        app.nonIsoDateConversion();
    }
}
