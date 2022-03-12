# Using `Argp`

```c
error_t argp_parse(
    const struct argp *argp, // structure
    int argc,           //  from main
    char **argv,        //  from main
    unsigned flags,     //  modify parsing behavior
                        //
                        //  ARGP_PARSE_ARGV0, take argv[0] into account
                        //  ARGP_NO_ERRS,
                        //          - not print error messages for unknown options
                        //          - implies ARGP_NO_EXIT
                        //  ARGP_NO_ARGS, dont parse non option arguments
                        //  ARGP_IN_ORDER, parse options and arguments in the same order as in the command line (normally they are re-arranged)
                        //  ARGP_NO_HELP, do not provide "--help" option
                        //  ARGP_NO_EXIT, don't exit on errors
                        //  ARGP_LONG_ONLY, use long options only (all start with "-" instead of "--")
                        //  ARGP_SILENT, 
                        //              - turns off message printing
                        //              - ???turns off exiting options???

    int *arg_index,     //  Either include ARGP_NO_EXIT or ARGP_NO_HELP, or
                        //      calling argp_parse might exit the function
                        //  If *arg_index is not NULL then this will have the value of
                        //  the first unparsed option
    void *input         //  If arg_index 
);

// return value is 0 for successful parsing
// ENOMEM -> memory allocation error
// EINVAL -> unknown option
```

## Argp Global Variables

### `const char * argp_program_version`

If set to non-zero (actual placeholder) `--version` option is enabled

behavior: program normally termninates when `--version` is used, unless

### `const char * argp_program_bug_address`

Set to a string that will be printed in de "debug" section of the "--help" option

In the sentence `Report bugs to address:`

So this a bit like a config parameter for the "--help" option

### `argp_program_version_hook`

- takes precedence over `const char * argp_program_version`
- useful if the program has version information not easily expressible in a simple string
- when non zero needs to point to a function with this cdecl
- 
cdecl:

```c
void print-version (FILE *stream, struct argp_state *state)
// struct argp_state ?.
```

## 25.3.3 Argp Parsers

The function `argp_parse` takes the following arguments

```c
struct argp {
    //  argp option vectors
    const struct argp_options *options;

    //  pointer to a function that defines parser actions
    //  called for each option parsed
    //  a value NULL is the same as a function returning `ARGP_ERR_UNKNOWN`
    
    argp_parser_t parser;

    //  not fully understand this, looks at what non option arguments,
    //      are called by this parser
    //  used when printing "Usage:"
    
    const char *args_docs;

    //  a pointer to a vector of "argp_child" structures
    //  specifies additional argp_parsers in a cascading(?) way

    const struct argp_child *children;

    //  pointer to a function that filters the output of help messages
    
    const *(*help_filter)(int key, const char **text, void *input)

    // not sure what this does

    const char *argp_domain

}
```

## `arg_help` function

```c

``` 

