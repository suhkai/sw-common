import java.util.Date;
import java.io.File;
import java.util.Map;
import java.io.BufferedReader;

fun readDictionary(file: File): Map<String, *> = file.inputStream().use {
    TODO("Read a mapping of strings to arbitrary elements.")
}

val intsFile = File("ints.dictionary")

tasks.register("type-checks3") {
    doLast {
        // We saved a map with `Int`s into that file
        //  --> not giving the warning below as expected
        // Warning: Unchecked cast: `Map<String, *>` to `Map<String, Int>`
        
        val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
      
    }
}

inline fun <reified A, reified B> Pair<*, *>.asPairOf(): Pair<A, B>? {
    if (first !is A || second !is B) return null
    return first as A to second as B
}

tasks.register("type-checks2") {
    doLast {
        val somePair: Pair<Any, Any> = "items" to listOf(1, 2, 3)

        val stringToSomething = somePair.asPairOf<String, Any>()
        val stringToInt = somePair.asPairOf<String, Int>()
        val stringToList = somePair.asPairOf<String, List<*>>()
        val stringToStringList = somePair.asPairOf<String, List<String>>()

        println("stringToSomething = " + stringToSomething)
        println("stringToInt = " + stringToInt)
        println("stringToList = " + stringToList)
        println("stringToStringList = " + stringToStringList)
        // below will cause classcast exception
        //println(stringToStringList.second.forEach() {it.length})
        //TODO("Read a mapping of strings to arbitrary elements.")
    }
}

tasks.register("type-checks") {
    doLast {
        val x: Any = IntArray(4);
        /*if (x is String){
            println("length="+x.length)
        }
        else if (x is Date){
            println("its a date")
        }*/
        when(x) {
            is Int -> print(x+1)
            is String -> print(x.length+1);
            is Array<*> -> println("its an array")
            is IntArray -> print(x.sum());
        }
        val d = Date(90)
        println(d);
        val y: Any? = null;
        val y2: String? = y as? String;
        println(y2 === null);
        (x as IntArray).forEach { k -> println(k) }
        (x as IntArray).forEach { println(it) }
        var l = List(5, { it*2+1 });
        println(l);
        if (l is List<*>){
            l.forEach { println(it) };
        }
        val list = List<String>(5, { "${it}" } );
        println(list::class);
        // -> class java.util.ArrayList

       

    }
}

tasks.register("strings") {
    doLast {
        val str = "hello darling"
        // uppercase is experimental, how so?
        @OptIn(kotlin.ExperimentalStdlibApi::class)
        for (c in str) {
            print("${c} ${c.uppercase()}");
        }
        println("");
        val s = """
        ${'$'}_99.99
        """
        println(s);
    }
}

tasks.register("arrays") {
    doLast {
        val arr = arrayOf<String>();
        val arrNulls = arrayOfNulls<String>(4);
        arrNulls.set(1,"hello")
        val x: IntArray = IntArray(5)
        println("array of ints  ${x[4]}")
    }
}

tasks.register("hello") {
   
    doLast {
        val one = 1
        val threeBillion = 300_000L
        val oneLong = 1L
        val oneByte = 1
        val PI: Double = Math.PI;
        val pif = PI.toFloat();
        println("pid:\t"+ PI);
        println("pif:\t" +  pif);
        println(5/2);
        val dtwo = 2.0;
        println( 5.toChar() );
        val x =  0..3
        println(String.format("%s", x));
        val zp = 0.0
        val zn = -0.0
        println(1/0.0);
        println(Double.POSITIVE_INFINITY);
        println(Double.NaN);
        println(0.0.compareTo(-0.0));
        val ub: UByte = 128.toUByte();
        println(ub);
        val text = """
        |Tell me and I forget.
        |Teach me and I remember.
        |involve me and I learn.
        |(Benjamin Franklin)
        """.trimMargin()
        println(text);
    }
}

