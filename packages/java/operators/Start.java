package operators;

public class Start {
    public static void main(String ...args) {
        int i = 0;
        System.out.println("i++" + (~i) + !true);
        System.out.println("i++" + (i));
        int shift = (-1 << 4);
        System.out.println(">> shift:" + shift);
        shift = (-16 >>> 1);
        System.out.println(">> shift:" + shift);
        shift = (-16 >> 1);
        System.out.println(">> shift:" + shift);
        {
            int k = 1;
            System.out.println("k="+k);
            
        }
    }
}
