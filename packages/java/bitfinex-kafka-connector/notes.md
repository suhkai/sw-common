# Some notes

Created in powershell with (note the use if `"`):

```powershell
mvn -B "archetype:generate" "-DgroupId=com.excomb.kafka_connectors" "-DartifactId=bitfinex-kafka-connector" "-DarchetypeArtifactId=maven-archetype-quickstart" "-DarchetypeVersion=1.4"
```

A fully qualified artifact name is (names are tags from the `pom.xml` file):

`<groupId>:<artifictId>:<version>`

I am here on 12-08-21
https://maven.apache.org/guides/introduction/introduction-to-profiles.html
