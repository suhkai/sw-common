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

#$(eval eval_available := T)

#ifeq ($(eval_available),T)
#ifneq ($(eval_available),T)
#$(error This makefule only works with "make program that supports $$(eval))
#endif

#foo: ; @echo $(eval_available)

#page 16
# Using Boolean Values

#VAR = hello
#ifdef VAR
#$(info VAR is defined)
#else
#$(info VAR is undefined)
#endif

# 2x interpolation?

#VAR_NAME = VAR
#VAR = some value
#ifdef $(VAR_NAME)
#$(info VAR is defined)

# make any truthy string "T"
#make-truth = $(if $1,$2,$3)
#foo: @echo $(call make-truth, ) # this is still "T" because there is an empty space between "," and ")"
#foo: @echo $(call make-truth,) # is "F"
#foo: ; @echo $(call make-truth,a,b,c) # becomes b
#foo: ; @echo $(call make-truth,,b,c) # becomes c

# page 19

#DO NOT USE "or" (reserved?) use "orZ" or "orWhatever"

#orZ = $(if $1$2,T,F)
#or = $(call make-truth,x,)
#foo: ; @echo $(call orZ,x,y) # will give T
#foo: ; @echo $(call orZ,,y) # will give T
#foo: ; @echo $(call orZ,,) # will give F

#andZ = $(if $1, $(if $2, T, F), F)
#foo: ; @echo $(call andZ,,) # will give F
#foo: ; @echo $(call andZ,x,y) # will give T
#foo: ; @echo $(call andZ,,y) # will give F


#page 20
#have_native_and := $(and T,T)
#have_native_or := $(or T,T)

#ifneq ($(have_nativ_and), T)
#and = $(if $1,$(if $2,T))
#endif
#ifneq ($(have_native_or),T)
#or = $(if $1$2,T,F)
#endif

#$(info This will be T: $(call and,T,T)) # = true

#HAVE_CURL := $(shell which curl)
#ifndef HAVE_CURL
#$(error curl is missing)
#endif
#
#$(info $(HAVE_CURL)) # /usr/bin/birl

#page 22
#assert-command-present = $(if $(shell which $1),,$(error '$1' missing and needed for this build))
#$(info $(call assert-command-present, curl))
#download: export _check = $(call assert-command-present,curl)
#download: ; @echo Download stuff...

# Delayed variable assignment

#BAR = before  
#FOO = $(BAR) the rain # "=" defines a recursive variable
#BAR = after

#$(info $(FOO)) ## lazy eval (recursive) at this point BAR=after

#SHALIST =$(eval SHALIST:= $(shell find ./lib1 -name '*.c' | xargs shasum))$(SHALIST)

#$(info Before use SHALIST is: $(value SHALIST))
#$(info SHALIST is: $(SHALIST))
#$(info After use SHALIST is: $(value SHALIST))

#$(info $(firstword $(SHALIST))) # first word
#$(info $(words $(value SHALIST))) # word count
#$(info $(wordlist $(SHALIST)))
#$(info $(foreach $(SHALIST)))

#MY_LIST = a program for directed compilation
#$(info the first word of the list is "$(firstword $(MY_LIST))")
#lastwordC = $(if $1,$(word $(words $1), $1))
#wordCount = $(words $1)
#partialC = $(if $1, $(word $(words $1), $1),empty)
# $(info the first word of the list is "$(lastwordC $(MY_LIST))")
#$(info by index: "$(call partialC,)")

# $(wordlist 2, $(words $1), $1)

#subrange = $(wordlist 2,$(words $1), $1)
#DATA=a program for directed compilation
#$(info $(call subrange,))



# notlast = $(wordlist 2,$(words $1), dummy $1) # cool trick
# step 1 the string is prefixed with a dummy word  "dummy hello world"
# step 2 the get rid of the last word just limit to the original wordcount
# 	the string has now become "dummy hello"
#   to get ridd of the original dull do we start cutting at index 2
# 
#  in javascript the logic would look like this

#var originalString = "...."
#var augmented = dummy + originalString
#var result = augmented.slice(2, originalString.length)

# $(info $(call notlast,))

# Page 25/26
# User defined functions
# The Basics
#make_date = $1/$2/$3
#today := $(call make_date,5,5,2014)
#$(info $(today))


#unix_to_dos = $(subst /,\,$1)
#$(info $(call unix_to_dos,"some/long/path"))

#page 26
#Argument-Handling Gotchas

#page 27
#Calling Built-in Functions
<<<<<<< HEAD


=======
>>>>>>> 5fd2d9538cfde8382cc4f692479c59d0803df1c6
#$(call info, "message")

#map = $(foreach a,$2,$(call $1,$a))
# $1="print-variable" function
# $2="foo, $(var1) bar ding bats, baz

#print-variable = $(info $1 [$(value $1)]->[$($1)] )

#print-variables = $(call map, print-variable, $1)
# $1= foo, $(var1) bar ding bats, baz

#main

#VAR1=foo
#VAR2=$(VAR1) bar ding bats
#VAR3=baz

#$(info $(value VAR2))

#$(call print-variables,VAR1 VAR2 VAR3)

# recursive calls

# first some elementary functions

# strip will trim whitespace and normalize whitespace
#$(info $(strip a  b  c   d   ))

# filter will "filter" regexp or literal strings
#$(info $(filter hello,hellox world)) # will find nothing
#$(info $(filter hello,hello world)) # will find hello
#$(info $(filter he%,hello world)) # will find hello


#check_uniq =$(info chku=($1,$2))$(if $(filter $1,$2), $2, $2 $1)

#sub_arr = $(wordlist 3, $(words $1 z), $1 $1)

#$(info words $(words a b c d))
#$(info sub_arr $(call sub_arr,a b c d a x y z))
#concat = $1 $2
#$(info $(call concat,a,b))
#                                     $2= unsorted string
#                                                if $2 is non empty
#                                                            $1=check_uniq
#														         $2= rest of worldlist with first element stripped
#																							         $3=  check_uniq (first word, )	
#                                                                                                                                    #end recursive reduce
#                                                                                                                                       #final result
#reduce = $(info REDUCE 1=$1,2=$2,3=$3)$(if $(strip $2),$(call reduce,$1,$(wordlist 2,$(words $2),$2), $(call $1,$(firstword $2),$3)   ),end=$3)
#reduce2 = $(call $1,$(firstword $2),$3)),$3)
#uniq = $(call reduce,check_uniq,$1) #$1 = check_uniq $2 =($1 = c b a a c c b a c b a)
#$(info result=$(call uniq,c b a a c c b a c b a))
#
#foo: ; @echo $(strip $(call uniq,c b a a c c b a c b a))
#
#$(info result=$(sort c b a a c c b a c b a))


#page 30
#.SECONDEXPANSION:

#FOO = foo
#all: $$(FOO)					# deferred
#all: ; @echo Making $@ from $?  # step-2: making all from bar
#bar: ; @echo Making $@			# step-1: making bar
#FOO = bar						# $$(FOO) will be bar

#page 31
#$(info include_dir:  $(.INCLUDE_DIRS))
#$(info features: $(.FEATURES))
#$(info default_goal: $(.DEFAULT_GOAL))
#$(info make_restarts: $(MAKE_RESTARTS))
#$(info lastword: $(lastword a b c d e f g))

#REC = foo
#SIM := foo
#$(info REC is $(flavor REC))
#$(info SIM is $(flavor SIM))
#$(info A or B or C.  $(or a,b,c))
#$(info A and B and C.  $( $(and a,b,x)))
#all: ; @true
#$(info $(abspath foo/bar)) # will be $cwd/foo/bar
#$(info $(abspath /foo/bar)) # will be /foo/bar
#$(info $(abspath dingbats)) # will be $cwd/dingbats
#$(info $(realpath dingbats)) # will be /tmp/dingbats (resolved symlink)
#.RECIPEPREFIX = >
#$(info .RECIPEPREFIX=[$(.RECIPEPREFIX)])
#$(info @echo $(.SHELLFLAGS))
#all:
#> @echo @true # instead of TAB

#.ONESHELL:
#.RECIPEPREFIX = >
#all:
#> @cd /tmp
#> @pwd
#> @ls -alh

#SPECIAL_FLAGS := xyz
#$(info SPECIAL_FLAGS [$(SPECIAL_FLAGS)])
#undefine SPECIAL_FLAGS # UNDEFINED 
#$(info SPECIAL_FLAGS [$(SPECIAL_FLAGS)])

#EMPTY :=
#$(info empty $(flavor EMPTY))   # simple
#EMPTY = $(something)
#$(info empty $(flavor EMPTY))   # recursive

#page 38
#FILE = foo.c

#define COMMANDS
#wc -l $(FILE)
#shasum $(FILE)
#endef
#
#define COMMANDS +=
#
#wc -c $(FILE)
#endef
#
#$(info COMMANDS=[$(COMMANDS)]) # will show first in output
#
#all: ; $(COMMANDS)  # now it will run all commands

# this is not working not sure why
#$(if $(guile (access? "/tmp2/foo.c" R_OK)),$(info foo.c exists),$(info does not exist))
#$(info guile-result $(guile (access? "/tmp2/foo.c" R_OK))) # this did not work

#all: one two three four
#one two:
#	@echo $@ line start
#	@sleep 0.1s
#	@echo $@ line middle
#	@echo $@ line finish
#three four:
#	@echo $@ line start
#	@sleep 0.2s
#	@echo $@ line middle
#	@echo $@ line finish

# RESULTS
#make -j4 

#one line start
#two line start
#three line start
#four line start

#one line middle
#two line middle
#one line finish
#two line finish

#three line middle
#four line middle
#three line finish
#four line finish	

#make -j4 -Otarget (no real difference with "make -j4")

#one line start
#two line start
#three line start
#four line start

#one line middle
#two line middle
#one line finish
#two line finish

#three line middle
#four line middle
#three line finish
#four line finish

#all: part-one part-two
#part-one: part-three
#	@echo Make $@   # because of all
#part-two:
#	@echo Make $@   # because of all
#part-three:
#	@echo Make $@   # because of part-one

#CURRENTLY != date

#$(info $(CURRENTLY) [$(flavor CURRENTLY)])

#LOG = make.logic

#$(file > $(LOG), Start)

#all: part-one part-two

#part-one: part-three
#	@$(file >> $(LOG),$@)
#	@echo Make $@
#part-two:
#	@$(file >> $(LOG),$@)
#	@echo Make $@
#part-three:
#	@$(file >> $(LOG),$@)
#	@echo Make $@

#$(info  $(MAKE_TERMOUT))
#$(info  $(MAKE_TERMERR))



