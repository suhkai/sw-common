# MAVEN_OPTS put in things for VM memory allocation at startup

- `MAVEN_OPTS="-Xms256m -Xmx512m"`  (deprecated use  "${projectdir}/.mvn/jvm.config")
- `/home/user/.m2/settings.xml`  (configuration of maven accross projects)
- `${projectdir}/.mvn/maven.config` (command line options, can put here or in a (bash) script)
- `${projectdir}/.mvn/jvm.config` (jvm configuration here)
- `${projectdir}/.mvn/extensions.xml` (manage extensions and plugins)

example:

`${projectdir}/.mvn/jvm.config` could contain a one liner

```bash
-Xmx2048m -Xms1024m -XX:MaxPermSize=512m -Djava.awt.headless=true
```
