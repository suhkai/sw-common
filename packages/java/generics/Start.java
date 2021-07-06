package generics;

import java.util.LinkedList;
import java.util.ArrayList;
import java.util.List;

import generics.Box;

public class Start {

    public static void main(String ...args) {
        var myIntList = new LinkedList<Integer>(); // 1
        myIntList.add(0); // 2
        myIntList.add(1); // 2
        myIntList.add(1); // 2
        for (int x: myIntList){
            System.out.println("item: "+x);
        }

        var iterator = myIntList.iterator();
        while (iterator.hasNext()){
            int i = iterator.next();
            System.out.println("item-iter: "+i);
        }

        List<String> ls = new ArrayList<String>(); //
        List<?> lo = ls; //
        ls.add("1");
        var box = new Box<Number>();
      
    }  
        
}
