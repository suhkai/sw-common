#define _(String) (String)

#define ML_VALID(x)	(!ISNAN(x))

#define ME_NONE		0
/*	no error */
#define ME_DOMAIN	1
/*	argument out of domain */
#define ME_RANGE	2
/*	value out of range */
#define ME_NOCONV	4
/*	process did not converge */
#define ME_PRECISION	8
/*	does not have "full" precision */
#define ME_UNDERFLOW	16
/*	and underflow occured (important for IEEE)*/

void error(char  *fmt, char *x) {};
void warning(char  *fmt, char *x) {};


#define MATHLIB_ERROR(fmt,x)		error(fmt,x);
#define MATHLIB_WARNING(fmt,x)		warning(fmt,x)
#define MATHLIB_WARNING2(fmt,x,x2)	warning(fmt,x,x2)
#define MATHLIB_WARNING3(fmt,x,x2,x3)	warning(fmt,x,x2,x3)
#define MATHLIB_WARNING4(fmt,x,x2,x3,x4) warning(fmt,x,x2,x3,x4)
#define MATHLIB_WARNING5(fmt,x,x2,x3,x4,x5) warning(fmt,x,x2,x3,x4,x5)
#define MATHLIB_WARNING6(fmt,x,x2,x3,x4,x5,x6) warning(fmt,x,x2,x3,x4,x5,x6)

#define ML_WARNING(x, s) { \
   if(x > ME_DOMAIN) { \
       char *msg = ""; \
       switch(x) { \
       case ME_DOMAIN: \
	   msg = _("argument out of domain in '%s'\n");	\
	   break; \
       case ME_RANGE: \
	   msg = _("value out of range in '%s'\n");	\
	   break; \
       case ME_NOCONV: \
	   msg = _("convergence failed in '%s'\n");	\
	   break; \
       case ME_PRECISION: \
	   msg = _("full precision may not have been achieved in '%s'\n"); \
	   break; \
       case ME_UNDERFLOW: \
	   msg = _("underflow occurred in '%s'\n");	\
	   break; \
       } \
       MATHLIB_WARNING(msg, s); \
   } \
}
