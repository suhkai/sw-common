#SHELL should be C:/Program Files/Git/usr/bin/sh.exe
#.ONESHELL:
classFiles := $(wildcard jkf/*.class)
#javaFiles := $(wildcard *.java) $(wildcard **/*.java)
#javaFiles := $(shell find ./src/main/ -name "*.java")

run:
	@cp target/bitfinex-kafka-connector-1.0-SNAPSHOT.jar target/lib/jars
	@java "-Dfile.encoding=UTF8"  -jar target/lib/jars/bitfinex-kafka-connector-1.0-SNAPSHOT.jar

build: clean $(javaFiles)
	-mvn compile
	-mvn package

clean:
	-mvn clean

.PHONY: clean run build



