package generics;

import java.util.LinkedList;

public class Start {
    public static void main(String ...args) {
        var myIntList = new LinkedList<Integer>(); // 1
        myIntList.add(0); // 2
        myIntList.add(1); // 2
        myIntList.add(1); // 2
        for (int x: myIntList){
            System.out.println("item: "+x);
        }
    }
}
