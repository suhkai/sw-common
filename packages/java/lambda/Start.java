package lambda;

public class Start {

    interface BinOp {
        int op(int a, int b);
    } 

    public static void main(String...args){

        BinOp fn = (a, b) -> { return a+b; };

        System.out.println(fn.op(1,2));

        return;
    }
}
