#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <argp.h>


double bessel_i(double x, double alpha, bool expon_scaled);
double bessel_j(double x, double alpha);
double bessel_k(double x, double alpha, bool expon_scaled);
double bessel_y(double x, double alpha);

static double nu = NAN;
static double begin = NAN;
static double end = NAN;

/**
  bessel --besselI -i  -xb -xe --scaled|-sc
  bessel --besselJ -j  -xb -xe -sc
  bessel --besselk -k  
  bessel --besselY -y
*/

const char *argp_program_bug_address = "jkfbogers@gmail.com";
const char *argp_program_version = "version 1.0.0 © Jacob Bogers 2022";

// void argp_failure (const struct argp_state *state, int status, int errnum, const char *fmt, …)
static int parse_opt(int key, char *arg, struct argp_state *state)
{
      double x;
      switch(key)
      {
            case 'i':
                  printf("choosing besselI\n");
                  break;
            case 'x':
                  x = strtod(arg, NULL);
                  printf("specific value [%s]=[%f], %d\n", arg, x, errno);
                  break;                  
            case ARGP_KEY_ARG:
                  printf("ARGP_KEY_ARG [%s]\n", arg);                                 ;
                  // error
                  break;
            case ARGP_KEY_END:
                  // processed last argument (or no argument at all?)
                  printf("ARGP_KEY_END\n")                                  ;
                  break;
      }
      return 0;
}

static struct argp_option options[] = {
     // { "besselJ", 'j', 0, 0, "K(nu), Bessel function of the first kind", 1 },
     // { "besselY", 'y', 0, 0, "Y(nu), Bessel function of the second kind" },
     // { "besselI", 'i', 0, 0, "I(nu), modifed Bessel function of the first kind"},
     // { "besselK", 'k', 0, 0, "K(nu), modifed Bessel function of the third kind" },
     // { 0, 'x', "NUM", 0, "use singular nu value (do not use with -b, -e, -d)", 25},
      { "begin", 'b', "NUM", 0, "start of nu domain (inclusive)", 50},
      { "end", 'e', "NUM", 0, "end of nu domain (inclusive)"},
      { "delta", 'd', "NUM", 0, "number of steps between -b and -e value" },
     
     // { "expon", 777, "'T' or 'F'", 0,"Only for I(nu) and K(nu), scale results exponentially ('T'rue or 'F'alse) default is 'F'alse"},
      { 0 }
};

// 0=contradiction, 
// 1 = singular, 
// 2 = sequence,
// -1 = neither singular or sequence defined,
// -2 = sequence partially defined
// int checkSingularOrSequence()

static struct argp argp = {
      options,
      parse_opt,
      //"hello\nworld world2",
      //"something.\velse"
};

double sequence_start = NAN;
double sequence_stop = NAN;
long sequence_steps = NaN;

int main(int argc, char **argv) {
      return argp_parse(&argp, argc, argv, 0, 0, 0);
}

