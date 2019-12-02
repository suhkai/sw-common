# STEPS

## preqequisites

- Os: Windows 10 Enterprise, Version: 1809, OS Build: 17763.864
- Node-version: v8.12.0

Make sure docker and node/npm are installed.

## Start the docker db

There is a docker-compose file `docker-compose.yml` in the project root

Start with:

```bash

docker-compose up db

```

output snippet when the mysqldb is running

```
db5.7_1  | 2019-12-02T15:33:22.212427Z 0 [Note] InnoDB: Creating shared tablespace for temporary tables
db5.7_1  | 2019-12-02T15:33:22.212472Z 0 [Note] InnoDB: Setting file './ibtmp1' size to 12 MB. Physically writing the file full; Please wait ...
db5.7_1  | 2019-12-02T15:33:22.224486Z 0 [Note] InnoDB: File './ibtmp1' size is now 12 MB.
db5.7_1  | 2019-12-02T15:33:22.225013Z 0 [Note] InnoDB: 96 redo rollback segment(s) found. 96 redo rollback segment(s) are active.
db5.7_1  | 2019-12-02T15:33:22.225042Z 0 [Note] InnoDB: 32 non-redo rollback segment(s) are active.
db5.7_1  | 2019-12-02T15:33:22.225233Z 0 [Note] InnoDB: Waiting for purge to start
db5.7_1  | 2019-12-02T15:33:22.275544Z 0 [Note] InnoDB: 5.7.28 started; log sequence number 103902463
db5.7_1  | 2019-12-02T15:33:22.275848Z 0 [Note] Plugin 'FEDERATED' is disabled.
db5.7_1  | 2019-12-02T15:33:22.277232Z 0 [Note] InnoDB: Loading buffer pool(s) from /var/lib/mysql/ib_buffer_pool
db5.7_1  | 2019-12-02T15:33:22.278808Z 0 [Note] InnoDB: Buffer pool(s) load completed at 191202 15:33:22
db5.7_1  | 2019-12-02T15:33:22.279912Z 0 [Note] Found ca.pem, server-cert.pem and server-key.pem in data directory. Trying to enable SSL support using them.
db5.7_1  | 2019-12-02T15:33:22.279941Z 0 [Note] Skipping generation of SSL certificates as certificate files are present in data directory.
db5.7_1  | 2019-12-02T15:33:22.280395Z 0 [Warning] CA certificate ca.pem is self signed.
db5.7_1  | 2019-12-02T15:33:22.280441Z 0 [Note] Skipping generation of RSA key pair as key files are present in data directory.
db5.7_1  | 2019-12-02T15:33:22.280718Z 0 [Note] Server hostname (bind-address): '*'; port: 3306
db5.7_1  | 2019-12-02T15:33:22.280760Z 0 [Note] IPv6 is available.
db5.7_1  | 2019-12-02T15:33:22.280768Z 0 [Note]   - '::' resolves to '::';
db5.7_1  | 2019-12-02T15:33:22.280775Z 0 [Note] Server socket created on IP: '::'.
db5.7_1  | 2019-12-02T15:33:22.284254Z 0 [Warning] Insecure configuration for --pid-file: Location '/var/run/mysqld' in the path is accessible to all OS users. Consider choosing a different directory.
db5.7_1  | 2019-12-02T15:33:22.293213Z 0 [Note] Event Scheduler: Loaded 1 event
db5.7_1  | 2019-12-02T15:33:22.293581Z 0 [Note] mysqld: ready for connections.
db5.7_1  | Version: '5.7.28-log'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server (GPL)
```

Once the DB is started run the test script with.

```bash
npm run test-insert-mysql2;
```




