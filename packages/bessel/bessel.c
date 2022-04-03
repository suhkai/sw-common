double bessel_i(double x, double alpha, double expo);
double bessel_j(double x, double alpha);
double bessel_k(double x, double alpha, double expo);
double bessel_y(double x, double alpha);

#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <argp.h>

// this is essentially a re-definition, will linux allow this?
// a mutable pointer to an immutable string

const char *argp_program_version = "R bessel functions (2022), version 0.0.1-alpha";
const char *argp_program_bug_address = "<jkfbogers@gmail.com>";
const char doc[] =
  "Argp example #2 -- a pretty minimal program using argp";


static char args_doc[] = "ARG1 ARG2"; // description of arguments we accept
// options
/* The options we understand. */
static struct argp_option options[] = {
  // name     key   argument name   flags doc   
  {"verbose", 'v',  0,              0,    "Produce verbose output" },
  {"quiet",   'q',  0,              0,    "Don't produce any output" },
  {"silent",  's',  0,              OPTION_ALIAS }, // alias for quiet
  {"output",  'o',  "FILE",         0,    "Output to FILE instead of standard output" },
  { }
};

// type
struct arguments
{
  char *args[2];                /* arg1 & arg2 */
  int silent;
  int verbose;
  char *output_file;
};

/* Parse a single option. */
// returns
//  - 0 (success)
//  - ARGP_ERR_UNKNOWN (not recognized)
//  - (other) some error
static error_t parse_opt (
  int key, //  An integer specifying which option this is (aka 'v', 'q', 's')
  char *arg, // argument for this option, or NULL if it has none
  struct argp_state *state // various usefull information about the parse state
  )
{
  struct arguments *arguments = state->input;

  switch(key){
    case 'q':
    case 's': // aliases
      arguments->silent = 1;
      break;
    case 'v':
      arguments->verbose = 1;
      break;
    case 'o':
      arguments->output_file = arg;
      break;
    case ARGP_KEY_ARG: // pure argument no option
      printf("ARGP_KEY_ARG/arg_num=[%d]\n", state->arg_num);
      if (state->arg_num >= 2)
      {
        // Too many arguments
        argp_usage (state); // this is an abort?
      }
      // set the argument
      arguments->args[state->arg_num] = arg;
      break;
    case ARGP_KEY_END:
      printf("ARGP_KEY_END/arg_num=[%d]\n", state->arg_num);
      if (state->arg_num < 2)
      {
        // Not enough arguments.
        argp_usage (state);  // this is an abort?
      }
      break;
    default:
      printf("waypoint1 [%c][%s]\n", key, arg);
      return ARGP_ERR_UNKNOWN; // what happens here?  
  }
  return 0; // ok
}

static const struct argp _argp = { 
  // options
  options, 
  // parser
  parse_opt,
  // args_doc, nonoptions arguments
  args_doc,
  // doc
  doc
  // children -> array of struct argp_child
  
  // struct argp_child {
      //  __const struct *argp; // should this not point back to the parent?
      //  int flags; // flags for this child
      //  __const chat *header; // optional header to be printed in the help output before child options;

      // Where to group the child options relative to the other (`consolidated')
      // options in the parent argp; the values are the same as the GROUP field
      // in argp_option structs, but all child-groupings follow parent options at
      // a particular group level.  If both this field and HEADER are zero, then
      // they aren't grouped at all, but rather merged with the parent options
      // (merging the child's grouping levels with the parents). 

      // int group;

  //}
};

extern char **environ;

int main(int argc, char **argv) {

    // this works, nice
    while (environ++ != NULL){
      printf("%s\n", *environ);
    }

    

    return 0;

    struct arguments arguments;

    arguments.silent = 0;
    arguments.verbose = 0;
    arguments.output_file = "-";

    argp_parse (
        &_argp, 
        argc, 
        argv,
        0,
        0,
        &arguments
    );

    //double answer = bessel_k(0.3, 10000, 1.0 + (double) true);
    //double answer = bessel_i(5, 1, 1.0);
    //printf("besseli => %e\n", answer);
    //answer = bessel_i(NAN, 0.0, 2.0);
    //printf("besseli NaN input=> %f\n", answer);
    printf("arguments.args[0]=[%s]\n", arguments.args[0]);
    printf("Einde\n");

    return 0;
}

