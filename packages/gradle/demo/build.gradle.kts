

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
        val zp = 0
        val zn = -0
        println(zp === zn);
    }
}

