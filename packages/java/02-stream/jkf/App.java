package jkf;

import java.util.stream.Stream;
import java.util.Arrays;
import java.util.List;
import java.util.StringJoiner;
import java.util.stream.IntStream;
import java.util.stream.Collector;
import java.util.stream.Collectors;



public class App {

    public App() {

    }

    class Person {
        String name;
        int age;

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
        var sji = 0;
        var aci = 0;
        var combi =0;
        Collector<Person, StringJoiner, String> personNameCollector =
                Collector.of(
                    () -> { // supplier
                        var sj = new StringJoiner(" | ");     
                        System.out.println("created: ${sji++}");
                        return sj;
                    },             
                    (j, p) -> { // accumulator
                        j.add(p.name.toUpperCase());
                        System.out.println("accum: ${aci++}");
                    },
                    (j1, j2) -> {
                        var sj = j1.merge(j2);
                        System.out.println("accum: ${combi++}");
                        return sj;
                    },
                    StringJoiner::toString
                );    
                            // finisher
        String names = persons
            .stream()
            .collect(personNameCollector);
        
        System.out.println(names);  // MAX | PETER | PAMELA | DAVID  
    }

    public static void main(String... argv) {
        var app = new App();
        app.doIt();
    }
}
