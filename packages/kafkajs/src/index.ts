import { Kafka } from 'kafkajs';
import { SchemaRegistry, SchemaType } from '@kafkajs/confluent-schema-registry';

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

const schema = `
  {
    "type": "record",
    "name": "RandomTest",
    "namespace": "examples",
    "fields": [{ "type": "string", "name": "fullName" }]
  }
`


// nothing else is returned
const { id } = await registry.register({ type: SchemaType.AVRO, schema });


//console.log('id, answer', id, answer);

const payload = { fullName: 'John Doe' }
const result = await registry.encode(id, payload);

//console.log(result.toString());

const backTopayload = await registry.decode(result)
//console.log(Object.getPrototypeOf(backTopayload), JSON.stringify(backTopayload));





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
    console.log('querying topics....');
    const allTopics = await admin.listTopics();
    console.log('Number of topics found:' + allTopics.length);

    const groups = await admin.listGroups();
    console.log('consumer groups', groups);

    const describeCluster = await admin.describeCluster();
    console.log('cluster config', JSON.stringify(describeCluster, null, 4));

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
        configEntries.forEach(ce => console.log(`config for broker ${nodeId}`, ce.configName));
    }


    for (const topic of allTopics) {
        console.log(`info for topic:${topic}`);
        const fetchTopicOffsets = await admin.fetchTopicOffsets(topic);
        console.log('\ttopic offset', fetchTopicOffsets);

        const fetchTopicOffsetsByTimestamp = await admin.fetchTopicOffsetsByTimestamp(topic);
        console.log('\ttopic offset by ts', fetchTopicOffsetsByTimestamp);

        const { resources: topicConfigs } = await admin.describeConfigs(
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
        for (const config of topicConfigs) {
            const { errorCode, errorMessage, resourceType, resourceName, configEntries: entries } = config;
            const kv = entries.map(({ configName, configValue }) => {
                return `${configName}=${configValue}`;
            });
            kv.sort();
            console.log(kv.join('\n'));
        }
    }


    //console.log('\ttopic configuration', JSON.stringify(describeConfig, null, 4));

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
    console.log('creating producer....')
    const producer = kafka.producer({
        allowAutoTopicCreation: false,
        //retry: { retries: 4 },
    });

    console.log('connecting the producer...');

    await producer.connect();

    console.log('sending message...'); schema
    const sendResult = await producer.send({
        topic: 'limit-order-bitfinex', messages: [{
            key: 'some-key',
            value: result
        }]
    });

    console.log('sendResult:', sendResult);



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

init()
    .then(() => console.log("started"))
    .catch(e => console.error("there was an error", e));
