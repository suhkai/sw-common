package lambda;

import java.lang.Runnable;
import java.util.concurrent.Callable;

import lambda.Person;

public class Start {

    interface BinOp {
        int op(int a, int b);
    } 

    public void localClassTest(){
        
    }

    public static void main(String...args) throws Exception {

        BinOp fn = (a, b) -> { return a+b; };

        Runnable run = () -> {
            System.out.println("hello wormd");
        };

        Callable<Integer> callIt = () -> {
            return 42;
        };

        System.out.println(fn.op(1,2));
        run.run();
        System.out.println(callIt.call());
        return;
    }
}

