package simple;

public class Cycle {
    class InnerClass {

    }

    static class StaticInnerClass {

    }

    public Cycle() {
        var arr = new int[10];
        var arr2 = new int[10];
        System.arraycopy(arr, 0, arr2, 0, 10);
        System.out.println("Cycle created:" + arr.length);
        System.out.println("speed="+speed);
    }

    static {
        var c = new Cycle();
        var ic = c.new InnerClass();
        var sic = new Cycle.StaticInnerClass();
    }

    InnerClass innerObject = new InnerClass();
    StaticInnerClass innerStaticObject = new Cycle.StaticInnerClass();
    
    final int speed = 0;
    int gear = 1;

    
    

    // 64 bits
    long along = 2 ^ 64 - 1;

    // 32 bits
    int cadence = 0;

    // 16 bits
    short aShort = 32767;

    // boolean
    boolean bb = false;


    // float
    float fl = 0.0f;

    // double
    double dl = 0.0d;

    // char
    int special = (int) ("ꞵ".charAt(0));

    String special2 = "🙋";

    int special4 = 1___0;

    // 8 bits
    float fl2 = 2E2f;

    // 8 bits
    final byte[] octets = { 01, 02, 03, 04 };

    // 
    float[][] somevar = { { 9.0f } };

    public final void changeCadence(int newValue) {
        this.cadence = newValue;
    }

    public String toString() {
        return "just a string";
    }
}