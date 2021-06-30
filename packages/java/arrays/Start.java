package arrays;
import java.util.Arrays;

public class Start {

    public static void main(String... args) {
        byte key = Byte.parseByte(args[0], 10);
        byte[] arr1 = { 0, 1, 2, 99, 2, 3, 4, 5 };
        byte[] arr2 = { 0, 1, 2, 99, 2, 3, 4, 5 };
        byte[] arr3 = { -1, 1, 2, 99, 2, 3, 4, 5 };

        args[0] = "hello world";
        System.out.println(Arrays.toString(args));

        args = null;
        System.out.println(Arrays.toString(args));

        Arrays.sort(arr1);
        Arrays.sort(arr2);
        Arrays.sort(arr3);

        int result = Arrays.binarySearch(arr1, key);

        if (result < 0){
            System.out.println("binsearch byte:**" + (-result -1));
        }
        else {
            System.out.println("binsearch byte:" + result);
        }

        System.out.println("(ref)equals return true:"+ arr1.equals(arr1));
        System.out.println("equals return true:"+  Arrays.equals(arr1, arr2));
        System.out.println("equals return false:"+ Arrays.equals(arr1, arr3));
        System.out.println("toString:"+ Arrays.toString(arr1));
    }
}
