$(eval @ := foo.o) $(eval % := ) $(eval < := foo.c) $(eval ? := foo.c) $(eval ^ := foo.c) $(eval + := foo.c) $(eval * := foo)
foo.o: foo.o.force
