#ifndef __OPTION_ARGS_H
#define __OPTION_ARGS_H

#include <stdint.h>
#include <stdbool.h>
#include <stdlib.h>


typedef struct _Token {
    uint id;
    uint start;
    uint end;
} Token;

typedef struct _TokenList {
    Token next;
    Token this;
    Token prev;
} TokenList;

typedef struct _Option {
    char * shortName;
    char * longName;
    char * argName;
    char * documentation;
    struct _Option * subOptions;
} Option;

typedef struct {
    char * title;
    Option * options;
} Section;

typedef struct _LinkedListItem {
    struct _LinkedListItem * prev;
    struct _LinkedListItem * next;
    void * value;
} LinkedListItem;


typedef struct _ArgOption {
    // IF "shortOptionName" = 0x00 and "longOptionName" = NULL and "documentation" = NULL respectively then this will be terminating the array of ArgOption[]
    char const shortOptionName; // could be NULL, means there is no short option
    char const * const longOptionName; // could be NULL means there is no long option
    char const * const argumentName; // show argument name in --help
    char const * const documentation; // normally documentation is the text you see in --help, if shortOptionName == 0x00 and longOptionName = NULL then documentation is grouping Option text
    bool const groupingValue; // Optional, options could be grouped functionally by providing a (integer > 0) groupingValue , if 0x00 it is ignored
    bool const orderWithinGroup; // Optional (optional must be > 0)
    bool const isRequired; // Optional (default false)
    uint const parent; // this is a sub-option, the "parent" is an index of the parent ArgOption (in an array of ArgOptions) 
} ArgOption;


//  global config
struct _Config {
    bool const longAsShortOptions;
    bool const exitOnError;
    char const * const version;
    char const * const usageArgumentText; // something like  "[OPTIONS] URL [URL...]" in "Usage: youtube-dl [OPTIONS] URL [URL...]"
    char const * ABIName; // non constant pointer to constant value = "basename(argv[0])"
    char const ** const usages;
    char const * generalText;
} Config;

char *join(char * strings, int const count);

#endif
