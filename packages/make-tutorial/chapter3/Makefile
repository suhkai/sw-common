# page 79
#all: foo.o bar.o
#foo.o: foo.c
#	$(COMPILE.C) -DDEBUG=$(DEBUG) -o $@ $<
#bar.o: bar.c
#	$(COMPILE.C) -o $@ $<

# BEST TO RE-WRITE SIGNATURE YOURSELF, THERE IS A "PROTOTYPE" IN THE BOOK, try to understand
# EVERY LINE

include signature

all: foo.o bar.o
foo.o: foo.c
	$(call do,$$(COMPILE.C) -DDEBUG=$$(DEBUG) -o $$@ $$<)

bar.o: bar.c
	$(call do,$$(COMPILE.C) -o $$@ $$<)

-include foo.o.sig bar.o.sig


# DO NOT DELETE
