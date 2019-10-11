


# [rabbitmqctl cluster](https://www.rabbitmq.com/clustering.htm)

Nodes are identified uniquely by node names.

A node name consist of two parts, a prefix (usually) and hostname.

When starting up a node, rabbit checks if it was assigned a node name
done via RABBITMQ_NODENAME variable

if RABBITMQ_NODENAME is not defined then then the node name will be `'rabbit'+<<hostname>>`

if a system uses FQDNs (fully qualified domain names) rabbitmq nodes and cli tools must
be configured to use long domain names

on the server set `RABBITMQ_USE_LONGNAME` to `true`

## Cluster formation requirements

### hostname resolution 

done via existing os mechanism. (e.g. /etc/hosts/)

Erlang can be configured to use alternate hostname resolution

### port access
  
- 4369: peer descovery service (epmd - erlang port mapper deamon),used by RabbitMQ nodes and CLI tools
- 5672,5671: used by amqp 0-9-1 and 1.0 clients (TLS or non-TLS)
- 25672: (20000 + 5672)  used for inter node communication (Erlang distribution server port). These ports should not be publicly exposed
- 35672-35682: used by CLI tools (Erlang distribution clients ports)
- 15672: http-api clients, management-ui, and rabbitmqadmin (only if mgmt plugin is enabled).
- 61613,61614: STOMP clients TLS/non-TLS (needs STOMP plugin)
- 1883, 8883: MQTT cleints, TLS/non-TLS (needs STOP plugin)
- 15674: STOMP over websocket (needs WEB STOMP plugin)
- 15675: MQTT-over-WebSocket clients (only if the Web MQTT plugin is enabled)
- 15692: Prometheus metrics (only if the Prometheus plugin is enabled).
    - [Prometheus](https://prometheus.io/docs/introduction/overview/) is an open-source systems monitoring and alerting toolkit originally built at SoundCloud.


### Nodes in a Cluster

#### What is replicated

All data/state required for the operation of a RabbitMQ broker is replicated accross all nodes.

See [rabbitmq high availablity queues](https://www.rabbitmq.com/ha.html).

- Exchanges are on all nodes, but queues by default are on a single node (can make sense)
- Queues can be optionally made mirrored
- Each mirror queue consist of a master and one or more mirrord queues.
- Master is hosted on one node (master node)
- all operations are applied to the master node first then to the mirror nodes
    - engueing publishers
    - delivering messages to consumers
    - tracking acknowledgement from consumers

Messages published are replicated to all queues. Queue mirroring enhances availability.
Queue mirroring does not distribute load accross nodes (all participating nodes do all the work).

If the node that hosts queue master fails. the oldest mirror will be promoted to the new master as long as it is synchronized.

You can manually synchronize a queue, active queues are not synchronized since they become unresponsive during synchronisation.

Be carefull when synchronizing queues in the size of gigabytes (persistent on disk?) this will take time and the queue is unavailable.

You can manually cancel ongoing queue synchronisation 

 - policy: `ha-promote-on-failure: when-synced|always`
 - policy: `ha-promote-on-shutdown:when-synced(default)|always`

Clusters that use `when-synched` promotion strategy when the master node failes 
(and the mirror queue is not synched ASK this its not clear from the ).

 - policy: `ha-sync-batch-size: 50000(example)`
 - policy: `net_ticktime` make sure that single batch synchronisation doesnt take longer then `net_ticktime`.

queue masters perform synchronisation in batches. Batch can be configured via the ha-sync-batch-size queue argument.
By synchronising messages in batches, the synchronisation process can be sped up considerably.

You can specify unsynchronized mirrors are not promoted (option) (to prevent data loss), **default value is always!!!!**.












Create a policy to mirror queues:

ha_mpo












