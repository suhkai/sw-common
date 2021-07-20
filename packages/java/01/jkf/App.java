package jkf;

import java.nio.charset.StandardCharsets;
import java.util.stream.Stream;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class App {

    public App() {
        byte _b = 127;
        short _s = 3;
        long _l = 3_000_000;
        float _f = 3.0f;
        double _d = 324E2;
        // local vars dont have default values,!!
        // below will throw compile error
        // boolean _bol;
        // System.out.println(""+_bol);
        short _s2 = 32767;
        int _i2 = (1 << 31);
        System.out.println(_i2);
        // _i2++;
        int i3 = _i2 - 1;
        System.out.println(i3);
        // '\u2230'
        byte[] tri = { (byte) 0xE2, (byte) 0x88, (byte) 0xB0 };
        var strTri = new String(tri, StandardCharsets.UTF_8);
        System.out.println(strTri);

        int hexVal = 0x1a;
        int binVal = 0b11010;
        int decVal = 26;

        System.out.println(hexVal);
        System.out.println(binVal);
        System.out.println(decVal);

        double dl = 123.4;
        double d2 = 1.23e2;
        float f1 = 123.4f;

        String s = "S[\u00ED] Se[\u00F1]or";
        System.out.println(s);

        long maxLong = 0x7fff_ffff_ffff_ffffL;
        System.out.println(maxLong);

        byte nybbles = 0b0010_0101;
        long bytes = 0b11010010_01101001_10010100_10010010;

        System.out.println(nybbles);
        System.out.println(bytes);

        float pi1 = 3.14_15F;
        int x3 = 5_______2;

        // error: int x4 = 0_x5_2;
        // int x5 = 0x_52;
        int x7 = 0x52_0;

        int[] anArray;

        anArray = new int[10];

        anArray[0] = 100;
        anArray[1] = 200;
        anArray[2] = 300;
        anArray[5] = 600;

        System.out.println("Element at index 0: " + anArray[0]);
        System.out.println("Element at index 1: " + anArray[1]);
        System.out.println("Element at index 2: " + anArray[2]);
        // System.out.println("Element at index 9: " + anArray[9]);

        int[] numArr = { 1, 2, 3, 4, -5 };

        String[][] names = {
            {"Mr. ", "Mrs. ", "Ms. "},
            {"Smith", "Jones"}
        };
    }

    public int doIt(int p) {
        p = 0;
        return p + 1;
    }

    public static void main(String... argv) {
        var app = new App();
        System.out.println("argument adjustment:" + app.doIt(3));
    }
}
