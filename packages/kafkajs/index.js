'use strict';

import { Kafka, CompressionTypes, logLevel, /*ConfigResourceTypes*/ } from 'kafkajs';


const topic = 'bar';

function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

const delay1s = delay.bind(delay, 1000);

async function init() {

    console.log("starting...", CompressionTypes, logLevel);

    const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['localhost:9092'],
        clientId: 'example-producer',
    });

    const admin = kafka.admin();
    await admin.connect();
    console.log('connected');
    console.log('listTopics:', await admin.listTopics());

    console.log("fetchTopicOffsets", (await admin.fetchTopicOffsets(topic)).sort((a, b) => {
        return a.partition - b.partition
    }));

    console.log('fetchTopicOffsetsByTimestamp', 
    (await admin.fetchTopicOffsetsByTimestamp(topic, new Date('2022').valueOf())).sort((a, b) => {
        return a.partition - b.partition
    }));

    console.log('listGroups', await admin.listGroups());

    //console.log(await admin.fetchOffsets({ groupId:0, topic: "bar" }));
    console.log('describeCluster', await admin.describeCluster());

    /*console.log(JSON.stringify(await admin.describeConfigs({
        includeSynonyms: false,
        resources: [
            {
                type: 2, //ConfigResourceTypes.TOPIC,
                name: 'bar'
            }
        ]
    }), null, 4));*/

    await admin.disconnect();


    const producer = kafka.producer({ allowAutoTopicCreation: false });
    await producer.connect();
    let cursor = 0;
    for (let i = 1; i < 4; i++) {
        await delay1s();
        cursor = (cursor + 1) % 2;
        console.log(cursor)
        await producer.send({
            topic: topic,
            messages: [
                { key: 'key5', value: "hello-world", partition: cursor },
                { key: 'key2', value: "\x00 Hello", partition: 2 }
            ]
        });

    }

    console.log("fetchTopicOffsets", (await admin.fetchTopicOffsets(topic)).sort((a, b) => {
        return a.partition - b.partition
    }));


    /*Properties props = new Properties();
    props.put("bootstrap.servers", "localhost:9092");
    props.put("acks", "all");
    props.put("retries", 0);
    props.put("linger.ms", 1);
    props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
    props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");*/

}

init().then(() => {
    console.log("started");
});
