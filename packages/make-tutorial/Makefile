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

#.PHONY: all foo bar baz

#VAR = global scope
#all: foo bar
#all: ; @echo In $@ VAR is $(VAR)

#foo: ; @echo In $@ VAR is $(VAR)

#bar: VAR += local scope
#bar: baz
#bar: ; @echo In $@ VAR is $(VAR)

#baz: ; @echo In $@ VAR is $(VAR)

#f%: VAR = starts with f


#.PHONY: all

#lib1_SRCS := $(wildcard lib1/*.c)
#lib2_SRCS := $(wildcard lib2/*.c)

#all: ; @echo In $@ lib1 is $(lib1_SRCS)
#all: ; @echo In $@ lib2 is $(lib2_SRCS)

#lib1_OBJS := $(lib1_SRCS:.c=.o)
#lib2_OBJS := $(lib2_SRCS:.c=.o)

#lib1/special.o: CPPFLAGS += -Wcomment
#lib1/%.o: CPPFLAGS += -fast
#all: $(lib1_OBJS) $(lib2_OBJS)

#all: ; @echo $(lib1_OBJS) $(lib2_OBJS)

#%.o: %.c ; @$(COMPILE.C) -o $@ $<

#page 13
# Version checking
#.PHONY: all
#all: ; @echo $(MAKE_VERSION)

#page 14

#need := 3.80
#ok := $(filter $(need),$(firstword $(sort $(MAKE_VERSION) $(need))))

#all: ; @echo $(ok)

#foo: ; @echo $(lastword $(sort $(MAKE_VERSION) $(need)))


#baz: ; @echo $(sort $(.FEATURES))


# the Tx is a dummy, anything is good
#is_feature = $(if $(filter $1,$(.FEATURES)),Tx)


#.PHONY: all
#all: ; @echo archives are $(if $(call is_feature,archives),, not)available
#foo: ; @echo $(origin .FEATURES)


#.PHONY: foo

#var1 := hello
#var2 := world

#has_features := $(if $(filter default,$(origin .FEATURES)),$(if $(.FEATURES),T))

#foo: ; @echo $(if $(var1), $(if $(var2), T))
