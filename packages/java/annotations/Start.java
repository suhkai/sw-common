package annotations;

import java.lang.annotation.*;

import java.lang.annotation.Retention;
import annotations.Schedule;

//@Retention(RetentionPolicy.RUNTIME)
@SuppressWarnings({ "deprecation", "unchecked" })
@Schedule(
    hour = 12
)
@Schedule(
    hour = 13
)
class Something {

    String str;

    void doSomething(Integer x){
        System.out.println("value of x="+x);
    }
}

public class Start {

    static void main(String ... args){

    }

}