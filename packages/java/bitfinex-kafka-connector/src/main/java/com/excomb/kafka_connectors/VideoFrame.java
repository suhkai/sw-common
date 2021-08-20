package com.excomb.kafka_connectors;

public class VideoFrame {
    private long number;

    VideoFrame(long nr){
        this.number = nr;
    }


    public long getNumber(){
        return this.number;
    }
}
