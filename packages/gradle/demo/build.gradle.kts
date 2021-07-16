
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

