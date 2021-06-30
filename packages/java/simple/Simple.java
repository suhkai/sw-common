package simple;

import simple.Cycle;

import java.util.Arrays;

class Simple {
    public static void main(String ...args) {
        var cycle = new simple.Cycle();

        
        //
        for (String arg: args){
            System.out.println(arg);
        }
        //
        var arr1 = new int[32];
        var arr2 = new int[64];

        
        Object[] objarr = { cycle };
        String str1 = Arrays.deepToString(objarr);
        System.out.println("deepobject:"+str1);
        var arr3 = Arrays.copyOfRange(arr1, 0, 5);
        System.out.println("arr1.length="+arr1.length);
        System.out.println("arr2.length="+arr2.length);
        System.out.println("arr3.length="+arr3.length);

        System.out.println("Hello Java" + cycle.toString()+"/"+0+cycle.special+"/"+cycle.special2);
        System.out.println("char:" + ("ꞵ".length()) );
        System.out.println("char0:" + ("ꞵ".charAt(0)));
        System.out.println("char1:" + ("ꞵ".charAt(1)));
        System.out.println("char2:" + ("ꞵ".charAt(2)));
        System.out.println("seq:" + 0xEA +"/"+0x9E+"/"+0xB5);
    }
}