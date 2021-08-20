package com.excomb.kafka_connectors;

import java.util.concurrent.Flow;

public class VideoPlayer implements Flow.Subscriber<VideoFrame> {
   
    Flow.Subscription subscription = null; //  is a "contract" send by counter party.
 
    @Override
    public void onSubscribe(Flow.Subscription subscription) {
        this.subscription = subscription;
        subscription.request(1); // only request one frame?
    }

    @Override
    public void onNext(VideoFrame item) {
        App.println("play #%d" , item.getNumber());
        try{
            Thread.sleep(3000);
        }
        catch(InterruptedException ie){
            
        }
        // remove line below to create artificial backpressure
        subscription.request(1); // request next one?  
    }

    @Override
    public void onError(Throwable throwable) {
        App.println("There is an error in video streaming: %s" , throwable.getMessage());
    }

    @Override
    public void onComplete() {
        App.println("Video has ended");
    }
}