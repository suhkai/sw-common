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
| boolean | true    |              | high       | read-only  |
</details>


[kafka-retention]: https://medium.com/@anandkolli/understanding-kafka-retention-e71055a36251

[kafka-offsets]: https://blog.actorsfit.com/a?ID=01000-8ff22f0c-7730-46d6-ac60-ee280048866f

[log-Compacting]: https://medium.com/swlh/introduction-to-topic-log-compaction-in-apache-kafka-3e4d4afd2262