package generics;

class A { }
class B { }
interface I1 {

}

interface I2 {

}

public class Multibound <T extends A & I1 & I2> {
    
}
