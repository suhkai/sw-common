package com.excomb.kafka_connectors;

//websockets

//nets
import java.net.URI;
//import java.net.URISyntaxException;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.http.HttpClient;

import java.net.http.HttpClient.Redirect;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse.BodyHandler;
import java.net.http.HttpResponse.BodyHandlers;
import java.net.http.HttpResponse.ResponseInfo;
import java.net.http.HttpResponse.BodySubscriber;

import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
//io
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.DoubleBuffer;
import java.time.Duration;

import java.lang.Thread;
import java.util.concurrent.*;
import java.util.function.Consumer;
import java.util.function.Supplier;

import static java.util.concurrent.Flow.Publisher;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;
import java.util.stream.Collector;
import java.util.Set;
import java.util.EnumSet;

import java.util.function.*;
import java.util.function.BiConsumer;
import java.util.function.BinaryOperator;
import java.util.function.Function;
import java.util.EnumSet;

import java.io.InputStream;
import java.util.Properties;

class Version {
    private static final Logger log = LoggerFactory.getLogger(Version.class);

    private static final String PROPERTIES_FILENAME = "aiven-kafka-connect-http-version.properties";

    static final String VERSION;

    static {
        final Properties props = new Properties();
        try (final InputStream resourceStream =
                 Version.class.getClassLoader().getResourceAsStream(PROPERTIES_FILENAME)) {
            props.load(resourceStream);
        } catch (final Exception e) {
            log.warn("Error while loading {}: {}", PROPERTIES_FILENAME, e.getMessage());
        }
        VERSION = props.getProperty("version", "unknown").trim();
    }
}

public class App {
    public static void println(String fmt, Object... args) {
        System.out.format(fmt + "%n", args);
    }

    private long waitInLoop(int n) {
        try {
            Thread.sleep(n * 1000);
        } catch (InterruptedException ie) {

        }
        return n;
    }

    public void futureTest() {
        ExecutorService threadpool = Executors.newCachedThreadPool();
        Publisher<String> l = null;
        Callable<Long> task = () -> this.waitInLoop(1);
        Future<Long> futureTask = threadpool.submit(task);

        while (!futureTask.isDone()) {
            App.println("FutureTask is not finished yet...");
        }
        try {
            long result = futureTask.get();
            App.println("result:%s", result);
        } catch (InterruptedException ie) {
            App.println("/exception/interrupted: %s", ie.getMessage());
            return;
        } catch (CancellationException ce) {
            App.println("/exception/cancellation: %s", ce.getMessage());
            return;
        } catch (ExecutionException ee) {
            App.println("/exception/execution: %s", ee.getMessage());
            return;
        }

        // CompletableFuture
        // CompletableFuture
        // CompletableFuture

        CompletableFuture<String> completableFuture = new CompletableFuture<>();

        threadpool.submit(() -> {
            Thread.sleep(500);
            completableFuture.complete("Hello");
            return null;
        });

        try {
            String result = completableFuture.get();
            App.println("Hello equals %s", result);
        } catch (InterruptedException ie) {
            App.println("/exception/completableFuture/interrupted: %s", ie.getMessage());
            return;
        } catch (CancellationException ce) {
            App.println("/exception/completableFuture/cancellation: %s", ce.getMessage());
            return;
        } catch (ExecutionException ee) {
            App.println("/exception/completableFuture/execution: %s", ee.getMessage());
            return;
        }

        threadpool.shutdown();

        CompletableFuture<String> cf = CompletableFuture.supplyAsync(() -> "Hello"); // immediately resolve future
        CompletableFuture<String> cf2 = cf.thenApply(s -> s + " world");
        App.println("cf2 className is:%s, hasCompleted:%b", cf2.getClass().getName(), cf2.isDone());

        CompletableFuture<String> cf3 = cf2.thenCompose(s -> CompletableFuture.supplyAsync(() -> s + " world"));
        Consumer<String> consume = (String s) -> App.println("thenAccept: %s", s);
        CompletableFuture<Void> cf4 = cf3.thenAccept(consume);

        var cf5 = CompletableFuture.supplyAsync(() -> "Hello");
        var cf6 = cf5.thenAcceptBoth(
                // another future
                CompletableFuture.supplyAsync(() -> "World"),
                // BiConsumer consumes but doesn't return
                (p, q) -> App.println(p + "- -" + q));

        try {
            App.println("primitive class void is %s", Class.forName("Void"));
        } catch (ClassNotFoundException cnfe) {
            App.println("class 'void' was not found: %s", cnfe.getMessage());
        }
        App.println("cf6 className is:%s, hasCompleted:%b", cf6.getClass().getName(), cf6.isDone());
        App.println("cf4 className is:%s, hasCompleted:%b", cf4.getClass().getName(), cf4.isDone());
        App.println("cf3 className is:%s, hasCompleted:%b", cf3.getClass().getName(), cf3.isDone());
        App.println("cf2 className is:%s, hasCompleted:%b", cf2.getClass().getName(), cf2.isDone());

        try {
            var rf2 = cf2.get();
            var rf3 = cf3.get();
            var rf4 = cf4.get();
            var rf6 = cf6.get();
            App.println("/cf2 completed value is: %s", rf2);
            App.println("/cf3 completed value is: %s", rf3);
            App.println("/cf4 completed value is: %s", rf4);
            App.println("/cf6 completed value is: %s", rf6);
        } catch (ExecutionException | CancellationException | InterruptedException e) {
            App.println("/exception/%s/: %s", e.getClass().getName(), e.getMessage());
        }

        // wait for all to complete
        CompletableFuture<String> future1 = CompletableFuture.supplyAsync(() -> "Hello");
        CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> "Beautiful");
        CompletableFuture<String> future3 = CompletableFuture.supplyAsync(() -> "World");

        CompletableFuture<Void> combinedFuture = CompletableFuture.allOf(future1, future2, future3);

        try {
            var rcf = combinedFuture.get(); // returns null (aka "void")
            var f1 = future1.get();
            var f2 = future2.get();
            var f3 = future3.get();
            App.println("allOf: %s", rcf);
            App.println("f1: %s", f1);
            App.println("f2: %s", f2);
            App.println("f3: %s", f3);

        } catch (ExecutionException | CancellationException | InterruptedException e) {
            App.println("/exception/%s/: %s", e.getClass().getName(), e.getMessage());
        }
        var name = Math.random() < 0.5 ? "Jacob" : null;

        CompletableFuture<String> cf7 = CompletableFuture.supplyAsync(() -> {
            if (name == null) {
                throw new RuntimeException("Computation error!");
            }
            return "Hello, " + name;
        }).handle(
                // BiFunction
                (s, t) -> s != null ? s : String.format("Hello, Stranger!, err:%s", t.getMessage()));
        try {
            var rc7 = cf7.get();
            App.println("cf7: %s", rc7);

        } catch (ExecutionException | CancellationException | InterruptedException e) {
            App.println("/exception/%s/: %s", e.getClass().getName(), e.getMessage());
        }

        // just creating a future like this doesn't do much,
        // one needs to resolve/reject one way or another
        var cf8 = new CompletableFuture<String>();
        // cf8.get(); at this point it will wait forever
        // "reject the future"
        cf8.completeExceptionally(new RuntimeException("Calculation failed!"));
        try {
            Thread.sleep(1000);
            cf8.get(); // will most certainly throw an exception
        } catch (InterruptedException | ExecutionException ie) {
            App.println("interrupted during sleep(1s): %s", ie.getMessage());
        }

        App.println("cf8 is done?: %b", cf8.isDone());

        var cf10 = CompletableFuture.supplyAsync(() -> "Hello");

        var f11 = cf10.thenApplyAsync(s -> {
            try {
                Thread.sleep(5000);
            } catch (Exception e) {
            }
            return s + " World 🌎";
        });

        try {
           var answer = f11.get();
           App.println("using thenApplyAsync: %s", answer);
        } catch (InterruptedException | ExecutionException ie) {
            App.println("interrupted during sleep(5s): %s", ie.getMessage());
        }

        ForkJoinPool.commonPool().awaitQuiescence(2000, TimeUnit.MILLISECONDS);
        App.println("finished");

    }


    public void doSomething(Runnable onError){
        onError.run();
    }



    public void streamIt(){
        App.println(">>> STREAM IT <<<");

        var executorService = Executors.newSingleThreadExecutor();
        var streamServer = new VideoStreamServer(executorService);
        streamServer.subscribe(new VideoPlayer());
        

        // totally new executor to send video-frames
        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
        
        // public class AtomicLong extends Number implements java.io.Serializable
        AtomicLong frameNumber = new AtomicLong(4);

        frameNumber.incrementAndGet();

        executor.scheduleWithFixedDelay(
            // Runnable
            () -> {
                var newFrameNr = frameNumber.getAndIncrement();

                if (newFrameNr > 20){
                    streamServer.close();
                    App.println("isShutdown (before shutdown): %b", executorService.isShutdown());
                    executorService.shutdown();
                    App.println("isShutdown (after shutdown): %b", executorService.isShutdown());
                    App.println("isTerminated (after shutdown): %b", executorService.isTerminated());
                    try{
                        executorService.awaitTermination(2, TimeUnit.SECONDS);
                        App.println("isTerminated (after awaitTermination): %b", executorService.isTerminated());
                    }
                    catch(InterruptedException ie){
                        App.println("awaitTermination Interrupted with error:%s", ie.getMessage());
                    }
                    executor.shutdown();
                    return;
                }
                
                var newFrame = new VideoFrame(newFrameNr);

                streamServer.offer(
                    // videoFrame
                    newFrame, 
                    // BiPredicate onDrop
                    (subscriber, videoFrame) -> {
                        // back pressure handling
                        // while handler is being invoked all other methods are blocked
                        // to other threads 
                        var rte = new RuntimeException("Frame#" + videoFrame.getNumber() + " dropped because of back-pressure");
                        subscriber.onError(rte); // will the subscriber un-sub ???
                        return true; // retry once
                    }
                );
            },
            0, // initialDelay
            1, // delay (sec)
            TimeUnit.SECONDS // millisecond
        );

        // AtomicLong errors = new AtomicLong();
        ///FlowApiLiveVideo.streamLiveVideo(PRODUCER_DELAY, FAST_CONSUMER_DELAY, BUFFER_SIZE, errors::incrementAndGet);

    }

    public void enumStream(){
        var values = OAuth2AuthorizationMode.values();
        var iterable = new Iterable<String>() {
            private int i = 0;

            @Override
            public Iterator<String> iterator() {
                return new Iterator<String>() {
                    public boolean hasNext(){ 
                        return i < values.length;
                    }
                    public String next() {
                        var rc = values[i].name();
                        i++;
                        return rc;
                    };
                };
            };
        };
        
        var joined = String.join(",", iterable);
        //T, A, R
        var collect = new Collector<String, List<String>, List<String>>() {
            // intermediate
            public Supplier<List<String>> supplier() {
                return ArrayList<String>::new;
            }
            // this is to weird
            public BiConsumer<List<String>,String> accumulator() {
                return new BiConsumer<List<String>,String>(){
                    // jesus  List::add works in a magic way
                    public void accept(List<String> t, String u){
                        App.println("t arg: %s", t.getClass().getName());
                        App.println("u arg: %s", u.getClass().getName());
                        t.add(u);
                    }
                };           
            }

            public BinaryOperator<List<String>> combiner(){
                return (left, right) -> { left.addAll(right); return left; };
            }

            public Function<List<String>, List<String>> finisher(){
                return (i) -> (List<String>) i;
            };

            public Set<Collector.Characteristics> characteristics(){
                //return EnumSet.of(Collector.Characteristics.IDENTITY_FINISH);
                //Set<Collector.Characteristics> CH_ID
                //= Collections.unmodifiableSet(EnumSet.of(Collector.Characteristics.IDENTITY_FINISH));
                var set = EnumSet.of(Collector.Characteristics.IDENTITY_FINISH);
                // set.add(Collector.Characteristics.CONCURRENT);
                //set.add(Collector.Characteristics.IDENTITY_FINISH);
                return set;//CH_ID;
            }
        };

        Collector<String, ?, List<String>> v1 = Collectors.toUnmodifiableList();

        List<String> OAUTH2_AUTHORIZATION_MODES =
            Arrays.stream(OAuth2AuthorizationMode.values())
                    .map(OAuth2AuthorizationMode::name)
                    .collect(collect);
        

        /*
            Collector<T, ?, List<T>> toUnmodifiableList() {
                return new CollectorImpl<>(
                                       (Supplier<List<T>>) ArrayList::new,
                                       List::add,
                                       (left, right) -> { left.addAll(right); return left; },
                                       list -> (List<T>)List.of( list.toArray() ),
                                       CH_NOID
                                     );
        */
        
       
        App.println("className: %s", values.getClass().getName());
        App.println("className: %s-%s", joined, OAUTH2_AUTHORIZATION_MODES);
        App.println("className: %s", OAUTH2_AUTHORIZATION_MODES.getClass().getName());

    }

    public void testLogging(){
        org.slf4j.Logger logger = LoggerFactory.getLogger(App.class);
        logger.info("info logging"); // works nicely
        int newT = 15;
        int oldT = 16;

        // using traditional API
        logger.debug("Temperature set to {}. Old temperature was {}.", newT, oldT);

       
       
    }

    public static void main(String[] args) {
       
        var app = new App();
        //app.futureTest();
        //app.streamIt();
        //app.enumStream();
        app.testLogging();

    }
}
