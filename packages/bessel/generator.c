#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <libgen.h>
#include <string.h>
#include <stdint.h>


#define TOKEN hyphen

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


const ArgOption options[] = {
  { 0, NULL, NULL, "Subtitle Options" },
  { 'a', "batch-file", "FILE",  "File containing URLs to download ('-' for stdin), one URL per line. Lines starting with '#', ';' or ']' are considered as comments and ignored." },
  { 0, "sub-lang", "LANGS", "Languages of the subtitles to download (optional) separated by commas, use --list-subs for available language tags" },
  { 0, NULL, NULL, "Authentication Options" },
  { 'u', "username", "USERNAME", "Login with this account ID"  },
  { 'p', "password", "PASSWORD", "Account password. If this option is left out, youtube-dl will ask interactively" },
  { '2', "twofactor", "TWOFACTOR", "Two-factor authentication code" },
  { 'n', "netrc", "Use .netrc authentication data" },
  { 0, "video-password",  "PASSWORD", "Video password (vimeo, youku)" },
  {}
};


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

void copyLinkedListItem(LinkedListItem *src, LinkedListItem * target){
    target->prev = src->prev;
    target->next = src->next;
    target->value = src->value;
}


LinkedListItem * llseek(LinkedListItem *list, int64_t count){
    while (count != 0){
        if (count > 0){
            if (list->next == NULL){
                break;
            }
            count--;
            list = list->next;
            continue;
        }
        // count < 0
        if (list->next == NULL){
           break;
        }
        count++;
        list = list->prev;
    }
    return list;
}

LinkedListItem * llstart(LinkedListItem *list){
    return llseek(list, (1L << 63));
}

LinkedListItem * llend(LinkedListItem *list){
    return llseek(list, (1L >> 63) - 1);
}

LinkedListItem * llInsertAfter(LinkedListItem *list, void * value){
    LinkedListItem * const li = malloc(sizeof(LinkedListItem));
    //   0     *     0
    //1. A <-> B <-> C
    //2.       B ->| 0
    li->prev = list;
    // X -> C 
    li->next = list->next;
    // X <- C
    if (list->next){
        list->next->prev = li;
    }
    // B -> X
    list->next = li;
    li->value = value;
    return li;
}

LinkedListItem * llInsertBefore(LinkedListItem *list, void * value){
    LinkedListItem * const li = malloc(sizeof(LinkedListItem));
    //   0     *     0
    //1. A <-> B <-> C
    li->next = list;
    li->prev = list->prev;
    // X <- C
    if (list->prev){
        list->prev->next = li;
    }
    // B -> X
    list->prev = li;
    li->value = value;
    return li;
}


LinkedListItem * llremove(LinkedListItem *list){
    LinkedListItem * li = list;
    LinkedListItem * rc = list;
    //   0     *     0
    //1. A <-> B <-> C
    //2. 0 |<- B <-> C
    //3. 0 |<- B ->| C
    if (li->prev){
        //1. A -> C
        li->prev->next = li->next;
    }
    
    if (li->next){
        //1.  A <- C
        //2. 0 |<- C
        li->next->prev = li->prev;
    }
    // 1. rc= C
    // 2. rc= C
    // 3. (NULL)
    rc = li->next;
    free(li);
    return rc;
}

// add to the list
LinkedListItem * llunshift(LinkedListItem *list, void * const value){
    LinkedListItem * start = llstart(list);
    LinkedListItem * const li = llInsertBefore(start, value);
    return li;
}

LinkedListItem * llshift(LinkedListItem *list){
    LinkedListItem * start = llstart(list);
    LinkedListItem * const li = malloc(sizeof(LinkedListItem));
    copyLinkedListItem(start, li);
    llremove(start);
    return li;
}


LinkedListItem * llpush(LinkedListItem *list, void * const value){
    LinkedListItem * end = llend(list);
    LinkedListItem * li = llInsertAfter(end, value);
    return li;
}

LinkedListItem * llpop(LinkedListItem *list){
    LinkedListItem * end = llend(list);
    LinkedListItem * const li = malloc(sizeof(LinkedListItem));
    copyLinkedListItem(end, li);
    llremove(end);
    return li;
}

// typedef void (*printer_t)(int);

typedef bool (*predicate_fun)(LinkedListItem * list, int index);

LinkedListItem *searchForward(LinkedListItem *list, predicate_fun fn) {
    int idx = 0;
    while (list){
        const bool rc = fn(list, idx++);
        if (rc){
            break;
        }
        list = list->next;
    }
    return list;
}



LinkedListItem *searchReverse(LinkedListItem *list, predicate_fun fn) {
    int idx = 0;
    while (list){
        const bool rc = fn(list, idx++);
        if (rc){
            break;
        }
        list = list->prev;
    }
    return list;
}



/*
int8_t and uint8_t
int16_t and uint16_t
int32_t and uint32_t
int64_t and uint64_t
*/








// parser and tokenizer, parser guides the tokenizer

//static detectShortOption(const char * data, cursor)



// define command line options to generate a sequence
/**
jacob@MS-B90611:~/repos/sw-common/packages$ bessel/argvtest --o -iooip --jklk
argc=4
i=0     v=[bessel/argvtest]
i=1     v=[--o]
i=2     v=[-iooip]
i=3     v=[--jklk] 

"bessel/argvtest" --o -iooip --jklk=98798 -k 8 -- - hello
argc=9
i=0     v=[bessel/argvtest]
i=1     v=[--o]
i=2     v=[-iooip]
i=3     v=[--jklk=98798]
i=4     v=[-k]
i=5     v=[8]
i=6     v=[--]
i=7     v=[-]
i=8     v=[hello]
*/

int main(int argc, char **argv) {
    Token const t = {
        4,5,6
    };

    TokenList const tList = {
        t, t, t
    };
    
    printf("argc=%d,%d,%d\n", argc, t.id, tList.next.id);

    /**
        int const * x;       // pointer to constant int   (int const) * x
        int * const x;       // constant pointer to int   int (* const x)
        int const * const x; // constant pointer to constant int  (int const) (* const x)
    */
    
    char const * const filename = basename(argv[0]);
    
    printf("[%s]\n", filename);
    // glue everything together before the 
    // hello 5,6
    // world 5,6
    // today 5,6
    // 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
    // h e l l o _ w o r l d _ t o d a y 0
    int totalLen = 0;
    for(int i = 1; i < argc; i++){
        totalLen += strlen(argv[i]) + (i == argc - 1 ? 0: 1); // make allowance for space except or final string terminator "0"
    }
    printf("total amount allocated=[%d]\n", totalLen);
    char * const inputLine = malloc(totalLen);
    if (inputLine == 0){
        fprintf( stderr, "Internal error cannot allocate memory to contain argument options\n");
        return -1;
    }
    // hello 5, 6
    // world 5, 6
    // today 5, 6
    // 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
    // h e l l o _ w o r l d _ t o d a y 0
    totalLen = 0;
    for(int i = 1; i < argc; i++) {
        int len = strlen(argv[i]); // 5, 5, 5
        memcpy(inputLine + totalLen, argv[i], len);
        *(inputLine + totalLen + len) = (i == ( argc  - 1 ) ? 0x00 : ' '); // (c + 5) = '_', (c + 6 + 5) = '_', (c + 12 + 5) = 0
        // advance
        totalLen += len + (i ==  argc  - 1  ? 0 : 1); // c = 6, c = 12, c = 17
    }
    printf("total length=[%d]\n", totalLen);
    printf("total length=[%d]\n", (int)strlen(inputLine));
    printf("one line string=[%s]\n", inputLine);
    free(inputLine);

    int64_t n = 1;

    n = (n << 63);

    printf("n=[%ld]\n", n); // 9.223372e+18
    return 0;
}
