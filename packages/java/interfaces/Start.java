package interfaces;

import interfaces.SimpleClient;

import java.nio.charset.StandardCharsets;
import java.util.*;

import java.util.Collections;

public class Start {

    enum ChessPlayer {
        WHITE, BLACK
    }

    public static void main(String... args) throws InterruptedException {
        var sc = new SimpleClient();
        System.out.println(sc.toString());

        System.out.println("Time in California: " + sc.getZonedDateTime("Blah blah").toString());
        var s = new Start();
        var obj = s.clone();
        System.out.println(obj);
        var obj2 = s.clone();
        System.out.println("2 equal objects?=" + (obj.equals(obj2)));
        System.out.println("hascode start=" + s.hashCode());
        System.out.println("hascode start=" + Integer.toHexString(s.hashCode()));
        System.out.println("toString start=" + s);
        System.out.println("toString start=" + s.toString());
        System.out.println("hascode obj=" + obj.hashCode());
        System.out.println("hascode obj2=" + obj2.hashCode());
        // class stuff
        var _class = s.getClass();
        System.out.println("class: " + _class.getName());
        System.out.println("class: " + _class.getSimpleName());
        System.out.println("class: " + _class.getTypeName());

        var x = Byte.valueOf("-128");
        System.out.println("Byte x: " + x);

        var x1 = Float.valueOf(-128);
        System.out.println("Float x2: " + x1);
        System.out.println("Float x2: " + x1.byteValue());

        var x2 = Float.valueOf(-128);
        System.out.println("Float x2: " + x2);

        System.out.println("Float 2.Compare(1.2): " + Float.valueOf(2).compareTo(2.2f));

        System.out.println("Integer From string:" + Integer.decode("2"));

        System.out.format("This is a string [%s]\n", "some-string");
        // %[argument_index$][flags][width][.precision]conversion
        // f float
        System.out.println("date: " + new java.util.Date());
        System.out.format("Local Time  [%tB]\n", java.util.Calendar.getInstance());

        System.out.println("math:" + Math.nextDown(1.2d));
        System.out.println("math:" + Math.nextDown(Math.nextDown(1.2d)));

        System.out.println("math.ceil:" + Math.ceil(-1.2));
        System.out.println("math.rint:" + Math.rint(-1.2));

        System.out.println("math.floor:" + Math.floor(-1.2));

        System.out.println("NaN double:" + Double.isNaN(Double.NaN));

        var ch = Character.valueOf('a');

        System.out.println("Char:" + ch);

        String text = "the quick brown fox jumps over the lazy dog!";

        char[] mainCommand = new char[text.length()];

        text.getChars(0, text.length(), mainCommand, 0);

        for (int i = 0, len = text.length(), half = Math.floorDiv(len, 2); i < half; i++) {
            char t = mainCommand[i];
            mainCommand[i] = mainCommand[len - i - 1];
            mainCommand[len - i - 1] = t;
        }

        System.out.println("reverse sort:" + new String(mainCommand));

        float abc = Float.valueOf("-34.0");

        System.out.println("float abc:" + abc);

        String fox = "🦊";

        byte[] foxBytes = fox.getBytes(StandardCharsets.UTF_8);

        System.out.format("the byte-length of [%s] is %d, the char-length is:[%d] \n", fox, foxBytes.length, fox.length());
        for (int i = 0; i < foxBytes.length; i++){
            System.out.format("char index %d, is [%x] \n", i, foxBytes[i]);
        }

        var fox2 = fox.subSequence(0, 4);
        System.out.format("subseq [%s] index %d \n", fox2.toString(), fox2.length());
    }

    @Override
    protected Object clone() {
        System.out.println("clone implemented");
        return new Object();
    }
}
