#export FOO=bar
#$(info $(shell printenv| grep FOO)) # nothing added or removed to the parent environement by above command
#all: ; @printenv |grep FOO # printenv in the current shell process

#export FOO=$(shell echo fooey)
#all: ; @echo FOO is $$FOO


#export FOO=barx
#$(info $(shell env FOO=$(FOO)y printenv | grep FOO))
#export FOO=barz
#all: ; @printenv | grep FOO

#env_file = /tmp/env
#env_shell = $(shell rm -f $(env_file))$(foreach V,$1,$(shell echo export $V=$($V) >> $(env_file)))$(shell echo '$2' >> $(env_file))$(shell /bin/bash -e $(env_file))

#export FOO=bar

#$(info $(call env_shell,FOO,printenv | grep FOO))
#all: ; @printenv | grep FOO

.PHONY: all foo bar baz

VAR = global scope
all: foo bar
all: ; @echo In $@ VAR is $(VAR)

foo: ; @echo In $@ VAR is $(VAR)

bar: VAR = local scope
bar: baz
bar: ; @echo In $@ VAR is $(VAR)

baz: ; @echo In $@ VAR is $(VAR)
