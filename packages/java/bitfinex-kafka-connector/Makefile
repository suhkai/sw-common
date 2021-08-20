#SHELL should be C:/Program Files/Git/usr/bin/sh.exe
.ONESHELL:
#classFiles := $(wildcard jkf/*.class)
javaFiles := $(wildcard jkf/*.java)

slf4j := C:\Users\MSI\.m2\repository\org\slf4j\slf4j-api\1.7.32\slf4j-api-1.7.32.jar
slf4j-simple := C:\Users\MSI\.m2\repository\org\slf4j\slf4j-simple\1.7.32\slf4j-simple-1.7.32.jar

# for testing path correctness
#run2:
#  ls C:\Users\MSI\.m2\repository\org\slf4j\slf4j-api\1.7.32\slf4j-api-1.7.32.jar

run:
	java "-Dfile.encoding=UTF8"  -cp "target/classes;${slf4j};${slf4j-simple}" com.excomb.kafka_connectors.App

build: clean $(javaFiles)
	-mvn compile

clean:
	-mvn clean

.PHONY: clean run build



