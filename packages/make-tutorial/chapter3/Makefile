# page 78

include signature

.PHONY: clean all

all: clean foo.o bar.o

clean:
	@rm -rf *.o

logger = $(info logging $1,$2,$3)

foo.o: foo.c
	$(call logger,$@,$<,$?)
	$(COMPILE.C) -DDEBUG=$(DEBUG) -o $@ $<

bar.o: bar.c
	$(call logger,$@,$<,$?)
	$(COMPILE.C) -o $@ $<








