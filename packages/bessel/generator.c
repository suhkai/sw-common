#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <libgen.h>
#include <string.h>


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
    return 0;
}
