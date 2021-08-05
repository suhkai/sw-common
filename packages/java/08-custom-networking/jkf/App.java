package jkf;




public class App {

    final static String NS = System.getProperty("line.separator");
    final static String CWD = System.getProperty("user.dir");

    static void println(String fmt, Object... args) {
        System.out.format(fmt + "%n", args);
    }

    public App() {

    }

    public static void main(String... argv) throws IOException, InterruptedException {
        var app = new App();
      
    }
}
