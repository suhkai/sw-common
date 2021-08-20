package com.excomb.kafka_connectors;

import java.util.concurrent.SubmissionPublisher;
import java.util.concurrent.ExecutorService;

/*
public class SubmissionPublisher<T> extends Object implements Flow.Publisher<T>, AutoCloseable 
*/

public class VideoStreamServer extends SubmissionPublisher<VideoFrame> {
    
    // 3 different constructors
    // 1. SubmissionPublisher​()
    // 2. SubmissionPublisher​(Executor executor, int maxBufferCapacity)
    //   - maxBufferCapacity, is max job lag per subscriber
    // 3. SubmissionPublisher​(
    //    a.  Executor executor,
    //    b.  int maxBufferCapacity,
    //    c.  BiConsumer<  //https://docs.oracle.com/javase/8/docs/api/java/util/function/BiConsumer.html
    //       i:  ? super Flow.Subscriber<? super T>,
    //       ii: ? super Throwable> handler
    // )
    public VideoStreamServer(ExecutorService service) {
        super(service, 1);
    }
}
