#SHELL should be C:/Program Files/Git/usr/bin/sh.exe

classFiles := $(wildcard jkf/*.class)
javaFiles := $(wildcard jkf/*.java)


# run is phone because it doesnt create a file
run: build $(classFiles)
	java "-Dfile.encoding=UTF8" -cp . jkf.App

$(classFiles): $(javaFiles)
	javac -encoding utf8 $(javaFiles)

build: $(javaFiles)
	javac -encoding utf8 $(javaFiles)	

clean:
	-rm -f $(classFiles)

.PHONY: clean run build
