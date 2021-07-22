package jkf;

import java.util.stream.Stream;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.NoSuchElementException;

import java.util.StringJoiner;
import java.util.stream.IntStream;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.Optional;
import java.util.Queue;
import java.util.LinkedList;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.ConcurrentSkipListSet;


public class App {
    
    public App() {
        Set set = new HashSet();
        set.add(null);
        System.out.println(set.getClass().getName());
        System.out.println(set.toArray()[0]);
        // ConcurrentSkipListSet 
        // - interface Set Collection, Iterable
        // - superclass "AbstractSet"
        var css = new ConcurrentSkipListSet<String>();
        System.out.println(css.getClass().getName());
        //
        Queue<String> q = new LinkedList<String>();
        System.out.println(String.format("className = %s", q.getClass().getName()));
        // peek, pop empty queue
        String pop;
        try {
            pop = q.element(); // throws if there are no elements
            System.out.println(String.format("element = %s", pop));
        }
        catch(NoSuchElementException  err){
            System.out.println("error for element():" +err);
        }

        pop = q.peek();
        System.out.println(String.format("peek = %s", pop));

        pop = q.poll();
        System.out.println(String.format("poll = %s", pop));

        try{
            pop = q.remove();
            System.out.println(String.format("remove = %s", pop));
        }
        catch(NoSuchElementException err){
            System.out.println("error for remove():" +err);
        }
    }

    public static void main(String... argv) {
        var app = new App();
    }
}
