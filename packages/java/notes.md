# Some notes

```java
System.arraycopy(src, srcIdx, dest, destIdx, length);
```

```java
Object[] objarr = { cycle };
String str1 = Arrays.deepToString(objarr);
 System.out.println("deepobject:"+str1);

var arr3 = Arrays.copyOfRange(arr1, 0, 5); 
// arr3 is now arr1[0,5]
```

## Methods

```java
java.util.Arrays.binarySearch // done
java.util.Arrays.equals // done
java.util.Arrays.fill
java.util.Arrays.sort  // done
java.util.Arrays.stream
```

`swith` ... `case` statement can use string literals

```java
switch(str.toLowerCase()){
    case "hello":
       break;
    case "world":
       break;
    default:
       break;   
  }
}
```

## local classes

- defined with a `{` `}` block, like `if` `while`, or method
- simular to inner classes, they have restriction on static methods, they must be `final` and not an expression (constant value)
- no static initializer or interfaces within local classes
- interface can only be defined in a top level class or in a static context
- can access local var (outside the local class) if they are "final" or "effectivly final" (value doesnt change)

## Anonymous classes

- anonymous classes are expressions

Example:

```java

interface HelloWorld {
        public void greet();
        public void greetSomeone(String someone);
}


HelloWorld frenchGreeting = new HelloWorld() {
    
    String name = "tout le monde";

    public void greet() {
        greetSomeone("tout le monde");
    }

    public void greetSomeone(String someone) {
        name = someone;
        System.out.println("Salut " + name);
    }
};
```
