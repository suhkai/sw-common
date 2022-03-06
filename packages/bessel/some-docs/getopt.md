# Using `getopt` and `getopt_long`

## Using `getopt`

Include header `unistd.h`

### `external int opterr`

if `opterr` is non zero getopt will print an error message to stderr stream if encountered unknown option (or option with missing "required" argument)

if `opterr = 0` then no error is printed but `?` is still returned by `getopt`

### `external int optopt`

When getopt sees unknown option (or option with missing required argument) it will be stored in `optopt`

### `external int optind`

Set by `getopt` to the index of the next element of array `argv` to be processed
Initial value is `1` since `argv[0]` is the command full path

### `external char * optarg`

point to argument of the option (if it has an argument)

### function `int getopt(int argc, char *const *argv, const char *options)`

`const` binds left (unless it is the first then it binds right)
`*` affects its whole LHS first

type `char * const` = `(char *) const` = is an immutable  char pointer
type `const char * const` = `((const char) *) const` =  is an immutable pointer to a const char"

#### argument `int argc`

Comes from `main`

#### argument `char *const *argv`

NB: `char *const *argv` = `(((char *) const) *) argv` = `((char *) const) argv[]`

Comes from `main

#### argument `const char *options`

NB: `const char *options` = `((const char) *) options` = `const char options[]`

- `--` option stops all scanning
- `x::` option 'x' takes an optional argument
- `x:` option 'x' has a required argument
- `-` argument not specified as options are associated with option char `\1`
- `+` is first char in *options, then first non option stops option processing
- `:` is first char in *options, then will return `:` then `?` when non option is encountered


### processing

- `getopt` returns next option from command line, if there are no more options returns `-1`
- There can still be command line arguments lift, aka `optind < argc`
- `getopt` returns `?` if it encounters unknown option
- no need to copy contents of `optarg` (points to data of `argv`)
- if option has an argument, `getopt` stores it in `optarg`
- if `opterr` is nonzero (default) `getopt` prints an error


## Using `getopt_long`

Defined in `getopt.h` (not in `unistd.h`)

Works the same as `getopt` but an extra `const option longopt[]` for decl of longoptions

```c
struct option {
    const char *name;               // name of long option
    int         has_arg;            //
                                    // - no_argument (or 0)
                                    // - required_argument (or 1)
                                    // - optional_argument (or 2)

    int        *flag;               // - if flag = NULL, not used equivalent short option
                                    //  value is return from "getopt_long()"
                                    // - else (flag is not null)
                                    //  if option is found
                                    //  - flag points to value and "getopt_long()" returns 0
                                    //  else
                                    //  - flag left unchanged

    int         val;                // val is the code to load into flag (on success?) 
};

```

```c
int getopt_long(
        int argc,                   <-- same as getopt
        char * const argv[],        <-- same as getopt
        const char *optstring,      <-- same as getopt
        const struct option *longopts, <-- different
        int *indexptr           <-- different
);
```

- If `getopt_long` encounters a short option it works the same as `getopt`.
- When getopt_long encounters a long option, it takes actions based on `int *flag` and `int val`.
- `int *indexptr` points to the `struct options` when it encounters a long option
- if a longoption has an argument in `optarg`. if the longopt has no argument the pointer `*optarg` is `NULL`
- when `getopt_long` has no more arguments to process it returns `-1`, `optind` points to next remaining argument in `argv`
