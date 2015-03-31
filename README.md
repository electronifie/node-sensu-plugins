# node-sensu-plugins - Sensu plugins written in Node.js
### mongodb-metrics
```
  Usage: mongo-metrics [options]

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -u, --username <username>  Username
    -p, --password <password>  Password
    -H, --hostname <hostname>  Server hostname
    -P, --port <port>          Server port
    -S, --scheme <scheme>      Scheme
    -d, --debug                Debug mode - write extra info to stderr
```

### check-rabbitmq
```
  Usage: check-rabbitmq [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -U, --url <url>        RabbitMQ Manager URL
    -f, --config <config>  Configuration file
    -d, --debug            Debug mode - write extra info to stderr
```

Patterns should be specified in the JSON configuration file specified as an argument to `-f|--config`.  Rules include a regular expression, a warning threshold, and a critical threshold, with these values being compared to the number of messages in the queues whose names match the supplied pattern.  Rules are processed on a first match basis.

The example configuration file supplied contains the following:
```
{"rules":[
  [".*.error", -1, 1],
  [".*", 100, 10000]
]}
```
Here the rules mean:
* For queues with names matching `.*.error`, do nothing for warnings, and if there are >= 1 messages in the queue then print a CRITICAL messages and exit with a return code of 2.
* For all other queues, with >= 100 messages print a WARNING message and exit 1, and with >= 1,000 messages print a CRITICAL message and exit 2.


