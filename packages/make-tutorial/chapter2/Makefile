#X=$(YS) hate $(ZS)
#Y=dog
#YS=$(Y)$(S)
#Z=cat
#ZS=$(Z)$(S)
#S=s
#
#all: ;@echo $(X)
#UI = hello world
#print-%: ; @echo $* = $($*)
#
#page 45

#Dumping Every Makefile Variable

#.PHONY: printvars
#printvars:
#	@$(foreach V,$(sort $(.VARIABLES)), \
#	$(if $(filter-out environ% default automatic, \
#	$(origin $V)),$(info $V=$($V) origin=$(origin $V)) ))

#.PHONY: pr2
#pr2:
#	@$(foreach V,$(sort $(.VARIABLES)), \
#	$(info V=$V  origin=$(origin $V)))

#.PHONY: pr3
#pr3:
#	$(info filter-out=$(filter-out environ% default automatic, automatic))

#define LEE
#z=1
#endef
# .VARIABLES is all environment VARS
#$(info VARIABLES=$(.VARIABLES))	

#VAR1 := something
#
#.PHONY: pr4
#pr4:
#	$(info V=$(VAR1)  origin=$(origin $(VAR1)), value=$(value $(VAR1)))
#

#Tracing Variable Values

#$(info MAKE=$(MAKE))

#V=$(warning TRACE Y)dog

# dit werkt matig
#ifdef TRACE
#.PHONY: _trace _value
#_trace: ; @$(MAKE) --no-print-directory TRACE= $(TRACE)='$$(warning TRACE $(TRACE))$(shell $(MAKE) --no-print-directory TRACE=$(TRACE) _value)'
#_value: ; @echo $(value $(TRACE))
#endif
#
#X=$(YS) hate $(ZS)
#Y=dog
#YS=$(Y)$(S)
#Z=cat
#ZS=$(Z)$(S)
#S=s
#
#all: $(YS) $(ZS)
#all: ; @echo $(X)
#
#$(YS): ; @echo $(Y) $(Y)
#$(ZS): ; @echo $(Z) $(Z)
#
#.PHONY: all
#$(warning TRACE $(TRACE))$(shell $(MAKE) TRACE=$(TRACE) _value)

#OLD_SHELL := $(SHELL)
#SHELL = $(warning Building $@$(if $<, (from $<))$(if $?, ($? newer)))$(OLD_SHELL) -x

#.PHONY: all

#all: foo.o bar

#bar: ; @touch $@

#include gmsl

#FOO := foo
#BAR := foo

#$(info $(call sne,$(FOO),$(BAR))) #make sure there are no spaces after the sne,
#$(call assert,$(call sne,$(FOO),$(BAR)),FOO and BAR should not be equal)


#page 56
#include gmsl
#$(call assert,$(FOO),FOO is not defined)
#include gmsl

# if MAKEFLAGS was extended with MAKEFLAGS += -i
#$(foreach o,$(MAKEFLAGS),$(call assert,$(call sne,-i,$o),/1 You can't use the -i option))

#$(call assert,$(if $(findstring i,$(firstword $(MAKEFLAGS))),,T), '/2 You can't use the -i option)

#$(call assert_exists,foo.txt)

# if -i was used on make cli
#$(info ($(patsubst -%,-,$(firstword $(MAKEFLAGS)))))

#page 57

#include gmsl

#assert_target_directory = $(call assert,$(wildcard $(dir $@)),Target directory $(dir $@) missing)

#foo/all: ; @$(call assert_target_directory)echo $@


#do the same with less code, aka not having to add $(call assert_target_directory) to each target

#include gmsl
#assert_target_directory = $(call assert,$(wildcard $(dir $@)),Target directory $(dir $@) missing)
#OLD_SHELL := $(SHELL)
#SHELL = $(call assert_target_directory)$(OLD_SHELL)

#foo/all: ; @echo $@

#page 58

# INTERACTIVE GNU DEBUGGER NEEDS gmd (gmd depends on gmsl)
include gmsl
include gmd

.PHONY: all foo bar
$(__BREAKPOINT)
MYVAR1 = hello
MYVAR2 = $(MYVAR1) everyone

all: MYVAR3 = $(MYVAR2)
all: foo bar
	$(__BREAKPOINT)
	@echo Finally making $@
foo bar:
	@echo Building $@
