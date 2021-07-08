package generics;

import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;
import java.util.Set;
import java.util.HashSet;

public class LowerBound {
    static public void  main(String... args){
        var li1 = new HashSet<Integer>();
        var li2 = new HashSet<Number>();
        LowerBound.addNumbers(new ArrayList<Number>(li2));
        LowerBound.addNumbers(new ArrayList<Integer>(li1));
    }

    public static void addNumbers(List<? super Integer> li){
        System.out.println("list length:"+li.size());
        for (var i: li){
            System.out.println("i:"+i);
        }
    }
}
