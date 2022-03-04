
kb2: bessel_k2_standalone.o
	cc -o $@ $< -lm

bessel_k2_standalone.o: bessel_k2_standalone.c
	cc -c $<

kbess: kb.o
	cc -o $@ $< -lm

kb.o: kb.c
	cc -c kb.c

	