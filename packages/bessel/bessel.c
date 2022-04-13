#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <argp.h>

#include <stdlib.h>
#include <stdio.h>



double bessel_i(double x, double alpha, bool expon_scaled);
double bessel_j(double x, double alpha);
double bessel_k(double x, double alpha, bool expon_scaled);
double bessel_y(double x, double alpha);

struct sequence_cli {
      double sequence_start;
      double sequence_end;
      unsigned long sequence_steps;
};

/**
  bessel --besselI -i  -xb -xe --scaled|-sc
  bessel --besselJ -j  -xb -xe -sc
  bessel --besselk -k  
  bessel --besselY -y
*/

const char *argp_program_bug_address = "jkfbogers@gmail.com";
const char *argp_program_version = "version 1.0.0 © Jacob Bogers 2022";

#define ERR_OVERFLOW_NAN 0x7FF8000000000002
#define ERR_UNDERFLOW_NAN 0x7FF8000000000003
#define ERR_USER_INIT_NAN 0x7FF8000000000004
#define ERR_PARSE_ERROR 0x7FF8000000000005

unsigned long parse_long(char *str){
      return strtoul(str, NULL, 10);
}

double parse_double(char *str){
      const double v = strtod(str, NULL);
      // overflow
      if (v == HUGE_VAL || v == -HUGE_VAL){
            return ERR_OVERFLOW_NAN;
      }
      // underflow
      printf("errno=%d\n", errno);
      if (v == 0 && errno == ERANGE){
            return ERR_PARSE_ERROR;
      }
      return v;
}

// 0 = fully specified
// 1 = no options specified
// 2 = partially specified
int validate_sequence(const struct sequence_cli *const seq){
      
      int count = 0;

      if (seq->sequence_start == ERR_USER_INIT_NAN){
            count++;
      }
      if (seq->sequence_end == ERR_USER_INIT_NAN){
            count++;
      }
      if (seq->sequence_steps == 0) {
            count++;
      }
      if (count == 0) { // complete
            return 0;
      }
      if (count == 3) { // sequence options untouched
            return 1;
      }
      return 2; // sequence options partially specified
}

// void argp_failure (const struct argp_state *state, int status, int errnum, const char *fmt, …)
static int parse_opt(int key, char *arg, struct argp_state *state)
{
      struct sequence_cli *const seq = state->input;
      switch(key)
      {
            case 'b':
                  //printf("-b option and argument [%s]\n", arg );
                  seq->sequence_start = parse_double(arg);
                  //printf("-b option and argument [%s] -> [%f]\n", arg, seq->sequence_start );                                 ;
                  break;
            case 'e':
                  //printf("-e option and argument [%s]\n", arg );                                 ;
                  seq->sequence_end = parse_double(arg);
                  //printf("-e option and argument [%s] -> [%f]\n", arg, seq->sequence_end );                                 ;
                  break;                  
            case 'd':
                  //printf("-d option and argument [%s]\n", arg);                                 ;
                  seq->sequence_steps = parse_long(arg);      
                  //printf("-d option and argument [%s] -> [%lu]\n", arg, seq->sequence_steps);                                 ;
                  break;
            case ARGP_KEY_ARG:
                  //printf("ARGP_KEY_ARG (sequence) domain [%s]\n", arg);
                  // error
                  break;
            case ARGP_KEY_END:
                  // processed last argument (or no argument at all?)
                  printf("ARGP_KEY_END (sequence) domain\n");
                  const int result = validate_sequence(seq);
                  printf("result of parsing cli: [%d]\n", result );
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
      //"something->\velse"
};



int main(int argc, char **argv) {
      struct sequence_cli seq = {  ERR_USER_INIT_NAN, ERR_USER_INIT_NAN, 0 };
      return argp_parse(&argp, argc, argv, 0, 0, &seq);
}

