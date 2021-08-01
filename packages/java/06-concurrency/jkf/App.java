package jkf;

import java.io.IOException;

import jkf.ImmutableRGB;

public class App {

    final static String NS = System.getProperty("line.separator");
    final static String CWD = System.getProperty("user.dir");

    static void println(String fmt, Object... args) {
        System.out.format(fmt + "%n", args);
    }

    public Thread morePrints() throws InterruptedException {

        final String[] importantInfo = { "Mares eat oats", "Does eat oats", "Little lambs eat ivy",
                "A kid will eat ivy too" };

        var runnable =new Thread( new Runnable() {
            public void printThreadStatus(){
                var ct = Thread.currentThread();
                var name = ct.getName();
                var prio = ct.getPriority();
                var isInterrupted = ct.isInterrupted();
                App.println("Exit thread=%s, priority=%d, interupted=%s", name, prio, isInterrupted);
                return;
            }
            public void run() {
                for (int i = 0;; i = (i + 1) % importantInfo.length) {
                    if (Thread.currentThread().isInterrupted()){ // does not clear the interupt flag
                        this.printThreadStatus();
                        break;
                    }
                    var text = importantInfo[i];
                    System.out.println(text);
                    try {
                        Thread.sleep(250);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                } // for
            }// run
        });// class
        runnable.start();
        return runnable;
    }

    public Thread runIt() {
        var runnable = new Runnable() {
            public void run() {
                try {
                    Thread.sleep(3000); // 3sec
                } catch (InterruptedException ie) {
                    System.out.println("Thread was interrupted");
                    return;
                }
                var ct = Thread.currentThread();
                var name = ct.getName();
                var prio = ct.getPriority();
                System.out.format("Exit of thread=%s, priority=%d%n", name, prio);
            }
        };

        var thr = new Thread(runnable);
        thr.start();
        return thr;
    }

    public App() {

    }

    public static void main(String... argv) throws IOException, InterruptedException {
        var app = new App();
        var thr = app.morePrints();
        
        Thread.sleep(1000);
        System.out.println("going to interrupt thread");
        thr.interrupt();
        thr.join();
        System.out.println("finished");
    }
}
