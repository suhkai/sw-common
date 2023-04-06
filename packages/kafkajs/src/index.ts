import { Kafka, CompressionTypes, logLevel, ResourceConfigQuery, Message } from 'kafkajs';

import limitOrderSchema from './shared/limit-order-schema.js';

import {
    SchemaRegistry,
    readAVSCAsync
} from "@kafkajs/confluent-schema-registry";

const SASL_USER_NAME = process.env.SASL_USER_NAME;
const SASL_USER_PASSWORD = process.env.SASL_USER_PASSWORD;
const KAFKA_BROKER = process.env.KAFKA_BROKER;
const REG_USER = process.env.REG_USER;
const REG_PASSWD = process.env.REG_PASSWD;


const registry = new SchemaRegistry({
    auth: {
        username: REG_USER,
        password: REG_PASSWD
    },
    host: 'https://psrc-8vyvr.eu-central-1.aws.confluent.cloud',
});

const registerSchema = async () => {

    const { id } = await registry.register(limitOrderSchema as any);
    return id;

};

const registryId = await registerSchema();

if (!registryId) {
    console.error(`Failed to register schema`);
    process.exit(1);
}

const data: Message[] = Array.from({ length: 1000 });
const base = Date.now();
for (let i = 0; i < 1000; i++) {
    const outgoingMessage = {
        key: `${i}`,
        value: await registry.encode(registryId, {
            tag: 'bitfinex-btc-usd',
            id: i,
            amount: Math.trunc(Math.random() * 100),
            price: Math.random() * 1E6,
            timestamp: Date.now() - base
        })
    };
    data[i] = outgoingMessage;
}




async function init() {
    const errors: string[] = [];
    if (!KAFKA_BROKER) {
        errors.push('kafka KAFKA_BROKER not defined');
    }
    if (!SASL_USER_PASSWORD) {
        errors.push('kafka SASL_USER_PASSWORD not defined');
    }
    if (!SASL_USER_NAME) {
        errors.push('kafka SASL_USER_NAME not defined');
    }
    if (!(KAFKA_BROKER && SASL_USER_PASSWORD && SASL_USER_NAME)) {
        console.error(errors.join('\n'));
        process.exit(1);
    }

    const kafka = new Kafka({
        clientId: `${Math.trunc(Math.random() * 1E6)}`,
        brokers: [KAFKA_BROKER],
        // authenticationTimeout: 10000,
        // reauthenticationThreshold: 10000,
        ssl: true,
        sasl: {
            mechanism: 'plain', // scram-sha-256 or scram-sha-512
            username: SASL_USER_NAME,
            password: SASL_USER_PASSWORD
        },
    });



    const admin = kafka.admin();
    await admin.connect();
    console.log('...connected');
    const allTopics = await admin.listTopics();

    for (const topic of allTopics) {
        //console.log(`topic:${topic}`);
        const fetchTopicOffsets = await admin.fetchTopicOffsets(topic);
        //console.log(fetchTopicOffsets);

        const fetchTopicOffsetsByTimestamp = await admin.fetchTopicOffsetsByTimestamp(topic);
        //console.log(fetchTopicOffsetsByTimestamp);

        const groups = await admin.listGroups();
        //console.log(groups);

        const describeCluster = await admin.describeCluster();
        //console.log(JSON.stringify(describeCluster, null, 4));

        for (const { nodeId } of describeCluster.brokers) {
            const describeConfigBroker = await admin.describeConfigs(
                {
                    includeSynonyms: false,
                    resources: [{
                        type: 4,
                        name: String(nodeId)
                    }]
                });
            const { configEntries } = describeConfigBroker.resources[0];
            //configEntries.forEach(ce => console.log(ce.configName));
        }

        const describeConfig = await admin.describeConfigs(
            {
                includeSynonyms: false,
                resources: [{
                    /*  
                        UNKNOWN = 0,
                        TOPIC = 2,
                        BROKER = 4,
                        BROKER_LOGGER = 8,
                    */
                    type: 2,
                    name: topic
                }]
            });
        //console.log(describeConfig);
    }
    /*
export interface ProducerConfig {
  createPartitioner?: ICustomPartitioner
  retry?: RetryOptions
  metadataMaxAge?: number
  allowAutoTopicCreation?: boolean
  idempotent?: boolean
  transactionalId?: string
  transactionTimeout?: number
  maxInFlightRequests?: number
}
    */
    const producer = kafka.producer({
        allowAutoTopicCreation: false,
        //retry: { retries: 4 },
    });

    /*
    export interface ProducerRecord {
  topic: string
  messages: Message[]
  acks?: number
  timeout?: number
  compression?: CompressionTypes
}
    */

    /*
    export interface Message {
      key?: Buffer | string | null
      value: Buffer | string | null
      partition?: number
      headers?: IHeaders
      timestamp?: string
    }
    */
    const metaData = await producer.send({
        topic: 'limit-order-bitfinex',
        acks: 1,
        messages: [{
            value: await registry.encode(registryId as number, {
                tag: 'bitfinex-btc-usd',
                id: 3,
                amount: Math.trunc(Math.random() * 100),
                price: Math.random() * 1E6,
                timestamp: Date.now() - base
            })
        }]
    });

    console.log('send.......');

    console.log('metaData>>', metaData);
    //await producer.sendBatch({ topicMessages: [{ topic: 'limit-order-bitfinex', messages: data }] });



    //await admin.disconnect();

    /*
 
     console.log("fetchTopicOffsets", ...(await admin.fetchTopicOffsets(topic)).sort((a, b) => {
         return a.partition - b.partition
     }));
 
     console.log('fetchTopicOffsetsByTimestamp',
         (await admin.fetchTopicOffsetsByTimestamp(topic, new Date('2022').valueOf())).sort((a, b) => {
             return a.partition - b.partition
         }));
 
     console.log('listGroups', await admin.listGroups());
 
 
     console.log('describeCluster', await admin.describeCluster());
 
     console.log(JSON.stringify(await admin.describeConfigs({
         includeSynonyms: false,
         resources: [
             {
                 type: 2, //ConfigResourceTypes.TOPIC,
                 name: 'bar'
             }
         ]
     }), null, 4));
 
     await admin.disconnect();
 
     /*
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
         */


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