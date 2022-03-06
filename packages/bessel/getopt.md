# Using getopt

Include header `unistd.h`

## `external int opterr`

if `opterr` is non zero getopt will print an error message to stderr stream if encountered unknown option (or option with missing "required" argument)

if `opterr = 0` then no error is printed but `?` is still returned by `getopt`

## `external int optopt`

When getopt sees unknown option (or option with missing required argument) it will be stored in `optopt`

## `external int optind`

Set by `getopt` to the index of the next element of array `argv` to be processed
Initial value is `1` since `argv[0]` is the command full path

## `external char * optarg`

point to argument of the option (if it has an argument)

## function `int getopt(int argc, char *const *argv, const char *options)`

`const` binds left (unless it is the first then it binds right)
`*` affects its whole LHS first

type `char * const` = `(char *) const` = is an immutable  char pointer
type `const char * const` = `((const char) *) const` =  is an immutable pointer to a const char"

### argument `int argc`

Comes from `main`

### argument `char *const *argv`

NB: `char *const *argv` = `(((char *) const) *) argv` = `((char *) const) argv[]`

Comes from `main

### argument `const char *options`

NB: `const char *options` = `((const char) *) options` = `const char options[]`

- `--` option stops all scanning
- `x::` option 'x' takes an optional argument
- `x:` option 'x' has a required argument
- `-` argument not specified as options are associated with option char `\1`
- `+` is first char in *options, then first non option stops option processing
- `:` is first char in *options, then will return `:` then `?` when non option is encountered


## processing

- `getopt` returns next option from command line, if there are no more options returns `-1`
- There can still be command line arguments lift, aka `optind < argc`
- `getopt` returns `?` if it encounters unknown option
- no need to copy contents of `optarg` (points to data of `argv`)
- if option has an argument, `getopt` stores it in `optarg`
- if `opterr` is nonzero (default) `getopt` prints an error