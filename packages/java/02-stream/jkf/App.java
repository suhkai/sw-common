package jkf;

import java.util.stream.Stream;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

import java.util.StringJoiner;
import java.util.stream.IntStream;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.Optional;

class Bar {
    String name;
    Bar(String name){
        this.name = name;
    }
    @Override
    public String toString(){
        return name;
    }
}
class Foo {
    String name;
    List<Bar> bars = new ArrayList<>();
    Foo(String name){
        this.name = name;
    }
}
class Outer {
    Nested nested;
}

class Nested {
    Inner inner;
}

class Inner {
    String foo;
}

// Outer -> Nested -> Inner -> "foo"

public class App {

    public App() {

    }

    class Person {
        String name;
        int age;
        //
        public int sji = 0;
        public int aci = 0;
        public int combi = 0;

        Person(String name, int age){
            this.name = name;
            this.age = age;
        }

        @Override
        public String toString(){
            return name;
        }
    }

    public void doIt() {
        List<String> myList = Arrays.asList("a1", "a2", "12");
        myList.stream().map(String::toUpperCase).sorted().forEach(System.out::println);

        Stream.of("a1", "a2", "12").map(String::toUpperCase).sorted().forEach(System.out::println);

        IntStream.range(1,4).forEach(System.out::println);

        List<Person> persons = Arrays.asList(
            new Person("Max", 18),
            new Person("Peter", 23),
            new Person("Pamela", 23),
            new Person("David", 12)
        );
 
        // this will slice
        List<Person> filteredList = 
            persons
                .stream()
                .filter(p -> p.name.startsWith("c"))
                .collect(Collectors.toList());

        System.out.println(filteredList);
       
        final var thisPerson = this;
        
        Collector<Person, StringJoiner, String> personNameCollector =
                Collector.of(
                    () -> { // supplier
                        var sj = new StringJoiner(" | ");     
                        return sj;
                    },             
                    (j, p) -> { // accumulator
                        System.out.println(j.getClass()+"+"+p.getClass());
                        j.add(p.name.toUpperCase());
                    },
                    /**
                     * A careful reading of the streams implementation code in ReduceOps.java 
                     * reveals that the combine function is called only when a ReduceTask completes,
                     * and ReduceTask instances are used only when evaluating a pipeline in parallel.
                     * Thus, in the current implementation,
                     * the combiner is never called when evaluating a sequential pipeline.
                     */
                    // combiner
                    (j1, j2) -> {
                        // not called?
                        var sj = j1.merge(j2);
                        return j1;
                    },
                    StringJoiner::toString
                );    
        // finisher
        String names = persons
            .stream()
            .collect(personNameCollector);
        System.out.println(names);  // MAX | PETER | PAMELA | DAVID  
        //
        List<Foo> foos = new ArrayList<>();

        // create foos
        IntStream.range(1, 4).forEach(i -> foos.add(new Foo("Foo"+i)));

        foos.forEach(f -> 
            IntStream
                .range(1, 4)
                .forEach(i -> 
                   f.bars.add(
                       new Bar("Bar" + i + " <- " + f.name)
                   )
                )
        );

        foos.stream()
            .flatMap( f -> f.bars.stream())
            .forEach(System.out::println);

        // second way using streams
        IntStream.range(1, 4)
            .mapToObj(i -> new Foo("Foo" + i))
            // side effects, "peek" returns void
            .peek(f -> { 
                IntStream
                    .range(1, 4)
                    .mapToObj(i -> new Bar("Bar" + i + "<-" + f.name))
                    .forEach(f.bars::add);
            })
            .flatMap(f -> f.bars.stream())
            .forEach(System.out::println);
        
        // Outer/Nested/Inner
        Outer outer = new Outer();
        if (
            outer != null 
            && 
            outer.nested != null
            &&
            outer.nested.inner != null
        )
        {
            System.out.println(outer.nested.inner.foo);
        }

        Optional.of(new Outer())
        .flatMap( o -> Optional.ofNullable(o.nested ))
        .flatMap( n -> Optional.ofNullable(n.inner))
        .flatMap( i -> Optional.ofNullable(i.foo))
        .ifPresent(System.out::println);

        persons
        .stream()
        // reduce to one value, find the highest age
        .reduce((p1,p2) -> p1.age > p2.age ? p1: p2)
        .ifPresent(System.out::println);


        Person result = persons
        .stream()
        // reduce to one value, find the highest age
        .reduce(
            new Person("", 0),  // collector?
            (p1,p2) -> {
                p1.age += p2.age;
                p1.name += p2.name+" ";
                return p1;
            });
        
            System.out.format("name=%s; age=%s\n", result.name.trim(), result.age);


            int ageSum = persons
                .stream()
                .reduce(0, 
                        // adder
                        (sum, p) -> sum += p.age,
                        // combiner
                        // not called in this case
                        (sum1, sum2) -> {
                            System.out.println("called");
                            return sum1 + sum2;
                        }
                );
             
            System.out.println(ageSum);  // 76

            Integer ageSum3 = persons
                .stream()
                .reduce(0,
                    (sum, p) -> {
                        System.out.format("accumulator: sum=%s; person=%s\n", sum, p);
                        return sum += p.age;
                    },
                    (sum1, sum2) -> {
                        System.out.format("combiner: sum1=%s; sum2=%s\n", sum1, sum2);
                        return sum1 + sum2;
                });

            int ageSum4 = persons
                .parallelStream()
                .reduce(0,
                    (sum,p) -> {
                        System.out.format("accumlat: sum=%s; person=%s\n", sum, p);
                        return sum += p.age;
                    },
                    (sum1, sum2) -> {
                        System.out.format("combiner: sum1=%s; sum2=%s\n", sum1, sum2);
                        return sum1 + sum2;
                    });
            // i am here https://winterbe.com/posts/2014/07/31/java8-stream-tutorial-examples/#parallel-streams
            
                

    }// doit
    public static void main(String... argv) {
        var app = new App();
        app.doIt();
    }
}
