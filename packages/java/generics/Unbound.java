package generics;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

class Alice { /* ... */ }

class Bob extends Alice { /* ... */ }

class WildcardError {

    void foo(List<?> l) {
        fooHelper(l);
    }

    public <T> void fooHelper(List<T> l){
        l.set(0, l.get(0));
    }
}

class WildcardErrorBad {
    void swapFirst(List<? extends Number> l1, List<? super Number> l2) {
      Number temp = l1.get(0);
      //l1.set(0, l2.get(0)); // expected a CAP#1 extends Number,
                            // got a CAP#2 extends Number;
                            // same bound, but different types
      l2.set(0, temp);	    // expected a CAP#1 extends Number,
                            // got a Number
    }
}

class Node<T> {

    public T data;

    public Node(T data) { this.data = data; }

    public void setData(T data) {
        System.out.println("Node.setData");
        this.data = data;
    }
}

class MyNode extends Node<Integer> {
    public MyNode(Integer data) { super(data); }

    public void setData(Integer data) {
        System.out.println("MyNode.setData");
        super.setData(data);
    }
}

public class Unbound {
    public static void main(String... args){
        List<Integer> li = Arrays.asList(1, 2, 3);
        var li2 = Arrays.asList(1, 2, 3);
        var li3 = Arrays.asList("");
        var li4 = Arrays.<String>asList();
        System.out.println("li: " + li.getClass().getTypeName());
        System.out.println("li2: " + li2.getClass().getName());
        System.out.println("li3: " + li3.getClass().getName());
        System.out.println("li4: " + li4.getClass().getName());
        var ln = new ArrayList<Integer>();
        ln.add(1);
        ln.add(2);
        List<? extends Integer> lb = ln;
        List<? extends Number> la = lb;
        System.out.println("extends Number:"+lb.get(0));

        MyNode mn = new MyNode(5);
        Node<?> n = mn;            // A raw type - compiler throws an unchecked warning
        mn.setData(4);
        Object y = n.data;
        int x = mn.data;  
        System.out.println("y:"+y);
       
        }

     <E> void excute(List<E> jobs){

     }   
}
