# Broker Configs

## Updating broker Configs

`Update mode` (as described in numerous `decl` taggen tables)
- `read-only`: updatable but requires broker restart for it to take effect
- `per-broker`: Can be updated dynamicly
- `cluster-wide`: Can be updated for single broker(s) or cluster-wide

### Example 1: Change the number of `log.cleaner.threads=2` for broker 1

```bash
> bin/kafka-configs.sh \
    --bootstrap-server localhost:9092 \
    --entity-type brokers \
    --entity-name 1 \
    --alter \
    --add-config log.cleaner.threads=2
```

### Example 2: Get Config information of broker "1"

```bash
> bin/kafka-configs.sh 
    --bootstrap-server localhost:9092 \
    --entity-type brokers \
    --entity-name 1 \
    --describe --all
```

### Example 3: Delete a parameter `log.cleaner.threads` from broker 1

```bash
> bin/kafka-configs.sh \
    --bootstrap-server localhost:9092 \
    --entity-type brokers \
    --entity-name 1 \
    --alter --delete-config log.cleaner.threads
```

### Example 4: Set parameter `log.cleaner.threads=2` for the entire cluster

```bash
# "--entity-name" and "--entity-type" are replaced by "--entity-default"
> bin/kafka-configs.sh \
    --bootstrap-server localhost:9092 \
    --entity-type brokers \
    --entity-default \   
    --alter \
    --add-config log.cleaner.threads=2
```


## `advertised.listeners`
<details>
  <summary><b>Details</b>(click to show)</summary>


> Listeners to publish to ZooKeeper for clients to use, 
> if different than the listeners 	config property.
> In IaaS environments, this may need to be different from the interface to which the broker binds.
>  If this is not set, the value for listeners will be used. Unlike listeners, it is not valid to advertise the 0.0.0.0 meta-address.
> Also unlike listeners, there can be duplicated ports in this property, 
> so that one listener can be configured to advertise another listener's address.
>  This can be useful in some cases where external load balancers are used.


| Type   | Default | Valid Values | Importance | Update mode |
| ------ | ------- | ------------ | ---------- | ----------- |
| string | null    |              | high       | per-broker  |

</details>

## `auto.create.topics.enable`
<details>
  <summary><b>Details</b>(click to show)</summary>


> Enable auto creation of topic on the server


| Type    | Default | Valid Values | Importance | Update mode |
| ------- | ------- | ------------ | ---------- | ----------- |
| boolean | true    |              | high       | read-only   |
</details>

## `auto.create.topics.enable`
<details>
  <summary><b>Details</b>(click to show)</summary>
> Enable auto creation of topic on the server

| Type    | Default | Valid Values | Importance | Update mode |
| ------- | ------- | ------------ | ---------- | ----------- |
| boolean | true    |              | high       | read-only   |

</details>

## `auto.leader.rebalance.enable`

<details>
  <summary><b>Details</b>(click to show)</summary>

>Enables auto leader balancing. A background thread checks the distribution of partition leaders at 
>regular intervals, configurable by `leader.imbalance.check.interval.seconds`. If the leader 
>imbalance exceeds `leader.imbalance.per.broker.percentage`, leader rebalance to the preferred
>leader for partitions is triggered.

| Type    | Default | Valid Values | Importance | Update mode |
| ------- | ------- | ------------ | ---------- | ----------- |
| boolean | true    |              | high       | read-only   |

</details>


## `background.threads`

<details>
  <summary><b>Details</b>(click to show)</summary>

>The number of threads to use for various background processing tasks

| Type | Default | Valid Values | Importance | Update mode  |
| ---- | ------- | ------------ | ---------- | ------------ |
| int  | 10      | [1,...]      | high       | cluster-wide |

</details>


## `broker.id`

<details>
  <summary><b>Details</b>(click to show)</summary>

>The broker id for this server.
>If unset, a unique broker id will be generated.
>To avoid conflicts between zookeeper generated broker id's and user configured broker id's,
>generated broker ids start from reserved.broker.max.id + 1.

| Type | Default | Valid Values | Importance | Update mode |
| ---- | ------- | ------------ | ---------- | ----------- |
| int  | 10      | [1,...]      | high       | read-only   |

</details>

## `compression.type`

<details>
  <summary><b>Details</b>(click to show)</summary>

>Specify the final compression type for a given topic.
>This configuration accepts the standard compression codecs ('gzip', 'snappy', 'lz4', 'zstd').
>It additionally accepts 'uncompressed' which is equivalent to no compression; and 'producer' which means retain the original compression codec set by the producer.

| Type   | Default  | Valid Values | Importance | Update mode  |
| ------ | -------- | ------------ | ---------- | ------------ |
| string | producer | [1,...]      | high       | cluster-wide |

</details>

## `control.plane.listener.name` (this is used when kafka uses zookeeper)

<details>
  <summary><b>Details</b>(click to show)</summary>

>Name of listener used for communication between controller and brokers. Broker will use the control.plane.listener.name to locate the endpoint in listeners list, to listen for connections from the controller.

For example, if a broker's config is:

```config
listeners = INTERNAL://192.1.1.8:9092, EXTERNAL://10.1.1.5:9093, CONTROLLER://192.1.1.8:9094

listener.security.protocol.map = INTERNAL:PLAINTEXT, EXTERNAL:SSL, CONTROLLER:SSL

control.plane.listener.name = CONTROLLER
```

On startup, the broker will start listening on "192.1.1.8:9094" with security protocol "SSL".

On controller side, when it discovers a broker's published endpoints through zookeeper, it will use the `control.plane.listener.name` to find the endpoint, which it will use to establish connection to the broker.

For example, if the broker's published endpoints on zookeeper are :
```bash
"endpoints" : [
  "INTERNAL://broker1.example.com:9092",
  "EXTERNAL://broker1.example.com:9093",
  "CONTROLLER://broker1.example.com:9094"
]
```
and the controller's config is :

```config
listener.security.protocol.map = INTERNAL:PLAINTEXT, EXTERNAL:SSL, CONTROLLER:SSL

control.plane.listener.name = CONTROLLER
```

then controller will use `broker1.example.com:9094` with security protocol `SSL` to connect to the broker.

If not explicitly configured, the default value will be null and there will be no dedicated endpoints for controller connections.


| Type   | Default | Valid Values | Importance | Update mode |
| ------ | ------- | ------------ | ---------- | ----------- |
| string | null    |              | high       | read-only   |

</details>

## `controller.listener.names` (Used in `KRAFT`)

Replaces the use of `constroller.listener.names` (kakfka uses zookeeper).

<details>
  <summary><b>Details</b>(click to show)</summary>

>A comma-separated list of the names of the listeners used by the controller. This is required if running in KRaft mode. The ZK-based controller will not use this configuration.

| Type   | Default | Valid Values | Importance | Update mode |
| ------ | ------- | ------------ | ---------- | ----------- |
| string | null    |              | high       | read-only   |

</details>

## `controller.quorum.election.backoff.max.ms`

## `controller.quorum.election.timeout.ms`

## `controller.quorum.fetch.timeout.ms`

## `controller.quorum.voters`

## `delete.topic.enable`

<details>
  <summary><b>Details</b>(click to show)</summary>

>Enables delete topic. Delete topic through the admin tool will have no effect if this config is turned off

| Type    | Default | Valid Values | Importance | Update mode |
| ------- | ------- | ------------ | ---------- | ----------- |
| boolean | true    |              | high       | read-only   |

</details>

## `leader.imbalance.check.interval.seconds`

<details>
  <summary><b>Details</b>(click to show)</summary>

>The ratio of leader imbalance allowed per broker. The controller would trigger a leader balance if it goes above this value per broker. The value is specified in percentage.

| Type | Default | Valid Values | Importance | Update mode |
| ---- | ------- | ------------ | ---------- | ----------- |
| long | 300     |              | high       | read-only   |

</details>

## `leader.imbalance.per.broker.percentage`

<details>
  <summary><b>Details</b>(click to show)</summary>

>The ratio of leader imbalance allowed per broker. The controller would trigger a leader balance if it goes above this value per broker. The value is specified in percentage.


| Type | Default | Valid Values | Importance | Update mode |
| ---- | ------- | ------------ | ---------- | ----------- |
| int  | 10      |              | high       | read-only   |


</details>

 ## `listeners`

 <details>
  <summary><b>Details</b>(click to show)</summary>

>Listener List - Comma-separated list of URIs we will listen on and the listener names.
>If the listener name is not a **security protocol**, `listener.security.protocol.map` must also be set.

>Listener names and port numbers must be unique.

>Specify hostname as `0.0.0.0` to bind to all interfaces.

> Leave hostname empty to bind to default interface.

Examples of legal listener lists:

```config
PLAINTEXT://myhost:9092,SSL://:9091
CLIENT://0.0.0.0:9092,REPLICATION://localhost:9093
```

| Type   | Default           | Valid Values | Importance | Update mode |
| ------ | ----------------- | ------------ | ---------- | ----------- |
| string | PLAINTEXT://:9092 |              | high       | per-broker  |

</details>


## `log.dir` <- `log.dirs`

 <details>
  <summary><b>Details</b>(click to show)</summary>

>Only used when `log.dirs` (plural) is not specified
>The directory in which the log data is kept (supplemental for log.dirs property)
a

| Type   | Default         | Valid Values | Importance | Update mode |
| ------ | --------------- | ------------ | ---------- | ----------- |
| string | /tmp/kafka-logs | high         | high       | read-only   |

</details>

## `log.dirs` → `log.dir`

 <details>
  <summary><b>Details</b>(click to show)</summary>

>If not specifed `log.dir` (singular) will be used
>The directories in which the log data is kept. If not set, the value in `log.dir` is used


| Type   | Default | Valid Values | Importance | Update mode |
| ------ | ------- | ------------ | ---------- | ----------- |
| string | null    | high         | high       | read-only   |

</details>


## `log.flush.interval.messages`

 <details>
  <summary><b>Details</b>(click to show)</summary>

>The number of messages accumulated on a log partition before messages are flushed to disk

| Type | Default             | Valid Values | Importance | Update mode  |
| ---- | ------------------- | ------------ | ---------- | ------------ |
| long | 9223372036854775807 | 1,...        | high       | cluster-wide |

</details>


## `log.flush.interval.ms` → `log.flush.scheduler.interval.ms`
 <details>
  <summary><b>Details</b>(click to show)</summary>


>The maximum time in ms that a message in any topic is kept in memory before flushed to disk. If not set, the value in log.flush.scheduler.interval.ms is used


| Type | Default | Valid Values | Importance | Update mode  |
| ---- | ------- | ------------ | ---------- | ------------ |
| long | null    |              | high       | cluster-wide |

</details>

## `log.flush.offset.checkpoint.interval.ms`
 <details>
  <summary><b>Details</b>(click to show)</summary>

>The frequency with which we update the persistent record of the last flush which acts as the log recovery point

| Type | Default | Valid Values | Importance | Update mode  |
| ---- | ------- | ------------ | ---------- | ------------ |
| int | 60000ms (1 minute)    | 0...              | high       | read-only |


</details>




[kafka-retention]: https://medium.com/@anandkolli/understanding-kafka-retention-e71055a36251

[kafka-offsets]: https://blog.actorsfit.com/a?ID=01000-8ff22f0c-7730-46d6-ac60-ee280048866f

[log-Compacting]: https://medium.com/swlh/introduction-to-topic-log-compaction-in-apache-kafka-3e4d4afd2262