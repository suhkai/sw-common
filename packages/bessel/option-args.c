#include "option-args.h"

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

char *join(char * strings, int const count){
    int totalLen = 0;
    for(int i = 1; i < count; i++){
        totalLen += strlen(strings[i]) + (i == count - 1 ? 0: 1); // make allowance for space except or final string terminator "0"
    }
    char * const inputLine = malloc(totalLen);
    if (inputLine == 0){
        fprintf( stderr, "Internal error cannot allocate memory to contain argument options\n");
        return NULL;
    }
    // glue everything together before the 
    // hello 5,6
    // world 5,6
    // today 5,6
    // 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
    // h e l l o _ w o r l d _ t o d a y 0
    totalLen = 0;
    for(int i = 1; i < count; i++) {
        int len = strlen(argv[i]); // 5, 5, 5
        memcpy(inputLine + totalLen, argv[i], len);
        *(inputLine + totalLen + len) = (i == ( count  - 1 ) ? 0x00 : ' '); // (c + 5) = '_', (c + 6 + 5) = '_', (c + 12 + 5) = 0
        // advance
        totalLen += len + (i ==  count  - 1  ? 0 : 1); // c = 6, c = 12, c = 17
    }
    return inputLine;
}