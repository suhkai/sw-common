#include <argp.h>
#include <stdlib.h>
#include <stdio.h>

#define ERR_OVERFLOW_NAN 0x7FF8000000000002
#define ERR_UNDERFLOW_NAN 0x7FF8000000000003
#define ERR_USER_INIT_NAN 0x7FF8000000000004
#define ERR_PARSE_ERROR 0x7FF8000000000005

// make it so it can be "unionnized"
struct sequence_cli {
      double sequence_start;
      double sequence_end;
      unsigned long sequence_steps;
};

static struct argp_option options[] = {
      { "begin", 'b', "NUM", 0, "start of nu domain (inclusive)", 50},
      { "end", 'e', "NUM", 0, "end of nu domain (inclusive)"},
      { "delta", 'd', "NUM", 0, "number of steps between -b and -e value" },
      { 0 }
};

// 0 = fully specified
// 1 = no options specified
// 2 = partially specified

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
                  seq->sequence_steps = strtoul(arg, NULL, 10);
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


struct argp argp = {
      options,
      parse_opt,
};
