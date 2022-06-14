#include <stdio.h>
#include <stdlib.h>
#include <libgen.h>
#include <string.h>
#include <stdint.h>
#include <stdlib.h>
#include <stdbool.h>
#include <ctype.h>
#include <regex.h> 

double bessel_i(double x, double alpha, bool expon_scaled);
double bessel_j(double x, double alpha);
double bessel_k(double x, double alpha, bool expon_scaled);
double bessel_y(double x, double alpha);

static char const * STR_TRUE = "TRUE";
static char const * STR_FALSE = "FALSE";

bool partiallyComp(char *truthy, char const * dict){
    int len = strlen(truthy);
    for (int s = 0; s < strlen(truthy) && s < strlen(dict); s++){
        if (
            toupper(dict[s]) != toupper(truthy[s])
           ){
            return false;
        }
    }   
    return true;
}

bool isTrue(char *thruthy){
    return partiallyComp(thruthy, STR_TRUE);
}

bool isFalse(char *thruthy){
    return partiallyComp(thruthy, STR_FALSE);
}

char getOption(char *str){
    if (str == NULL){
        return 0;
    }
    if (!(str[0] == '-' && (str[2] == '=' || str[2] == 0))){
        return 0;
    }
    return str[1];
}

char *getOptionArgument(char *str){
    if (!getOption(str)){
        return NULL;
    }
    if (str[2] != '='){
        return NULL;
    }
    return str+3;
}

 bool parseScaleArgument(int nrArgs, char **cli, bool * exponentScale){
    if (nrArgs < 1){
        fprintf(stderr, "number of arguments for bessel is incorrect, nrArgs=[%d]\n", nrArgs + 3);
        return false;
    }
    if (getOption(cli[0]) != 's'){
        fprintf(stderr, "-s option not found\n");
        return false;
    }
    char * scaleArgument = getOptionArgument(cli[0]);

    
    if (!isTrue(scaleArgument) && !isFalse(scaleArgument)){
        fprintf(stderr, "-s argument should have value \"true\" or \"false\", instead it is [%s]\n", scaleArgument);
        return false;
    }
    *exponentScale = isTrue(scaleArgument) ? true : false;
    //printf("scaleArgument = [%d]\n", *exponentScale);
    return true;
 }

bool parse2Arguments(int nrArgs, char **cli, double *xStart, double *xStop,  double *xDelta, double *alpha){
    char xstartStringData[150];
    char * xstartStringEndPointer;
    char xstopStringData[150];
    char * xstopStringEndPointer;
    char xdeltaStringData[150];
    char * xdeltaStringEndPointer;
    char alphaStringData[150];
    char * alphaStringEndPointer;

    if (nrArgs < 2){
        fprintf(stderr, "number of arguments for bessel is incorrect, nrArgs=[%d]\n", nrArgs + 1);
        return false;
    }
    if ( getOption(cli[0]) != 'x'){
        fprintf(stderr, "-x argument option not found\n");
        return false;
    }

    // parse -x option argument

    char * xArguments = getOptionArgument(cli[0]);
    
    regex_t regex;
    
    int reti = regcomp(&regex, "^([^,]+),([^,]+),([^,]+)$", REG_ICASE|REG_EXTENDED);
    if (reti) {
        fprintf(stderr, "Could not compile regex\n");
        return -10;
    }

    regmatch_t pmatch[4];    

    int status = regexec(&regex, xArguments, 4, pmatch, 0);
    regfree(&regex);
    if (status) {
        char errorBuffer[150];
        regerror(status, &regex, errorBuffer, 150); 
        fprintf(stderr, "exec status = [%d], [%s]\n", status, errorBuffer);
        return -11;
    }
    int lenXStart = pmatch[1].rm_eo-pmatch[1].rm_so;
    int lenXStop =  pmatch[2].rm_eo-pmatch[2].rm_so;
    int lenXDelta =  pmatch[3].rm_eo-pmatch[3].rm_so;



    memcpy(xstartStringData, xArguments, lenXStart);//+pmatch[1].rm_so, pmatch[1].rm_eo-pmatch[1].rm_so);
    xstartStringData[lenXStart] = 0;
    
    memcpy(xstopStringData, xArguments + pmatch[2].rm_so, lenXStop);
    xstopStringData[lenXStop] = 0;
    
    memcpy(xdeltaStringData, xArguments + pmatch[3].rm_so, lenXDelta);
    xstopStringData[lenXDelta] = 0;

    strncpy(xdeltaStringData, xArguments+pmatch[3].rm_so, pmatch[3].rm_eo-pmatch[3].rm_so);
       
    printf("xArguments=[%s]\n", xArguments);
    printf("[%d],[%d]\n", pmatch[0].rm_so, pmatch[0].rm_eo);
    printf("[%d],[%d]\n", pmatch[1].rm_so, pmatch[1].rm_eo);
    printf("[%d],[%d]\n", pmatch[2].rm_so, pmatch[2].rm_eo);
    printf("[%d],[%d]\n", pmatch[3].rm_so, pmatch[3].rm_eo);

    printf("xstartStringData=[%s]\n", xstartStringData);
    printf("xstopStringData=[%s]\n", xstopStringData);
    printf("xdeltaStringData=[%s]\n", xdeltaStringData);

    *xStart = strtod(xstartStringData, &xstartStringEndPointer);
    *xStop = strtod(xstopStringData, &xstopStringEndPointer);
    *xDelta = strtod(xdeltaStringData, &xdeltaStringEndPointer);

    printf("after strtod=%.23lf,%.23lf,%.23lf\n", *xStart, *xStop, *xDelta);

    
    if (*xStop < *xStart){
        fprintf(stderr, "Bessel cannot have an [xStop]=[%.23lf] smaller then [xStart]=[%.23lf]\n", *xStart, *xStop);
        return false;
    }

    if (*xDelta > (*xStop - *xStart)){
        fprintf(stderr, "Bessel cannot have an [xDelta]=[%.23lf] bigger then [xStop-xStart]=[%.23lf]-[%.23lf]=[%.23lf]\n", *xDelta, *xStop, *xStart, (*xStop-*xStart));
        return false;
    }
    // parse -a option argument

    if (getOption(cli[1]) != 'a'){
         fprintf(stderr, "-a argument option not found\n");
         return false;
    }

    char * alphaArguments = getOptionArgument(cli[1]);
    printf("alpha=[%s]\n",alphaArguments);
    *alpha = strtod(alphaArguments, &alphaStringEndPointer);
    printf("alpha=[%.23lf]\n", *alpha);
    return true;
}


int main(int argc, char **argv) {

    if (!(argc == 4 || argc == 5)) {
        fprintf(stderr, "Wrong number of arguments\n");
        fflush(stderr);
        return -1;
    }
    
    /**
        int const * x;       // pointer to constant int   (int const) * x
        int * const x;       // constant pointer to int   int (* const x)
        int const * const x; // constant pointer to constant int  (int const) (* const x)
    */

    // argv[1] must be 
    // 1 "-j" besselJ, | -j -x=0,100,0.1 -a=0.23           |3+1
    // 2 "-i" besselI  | -i -x=0,100,0.1 -a=0.23 -s=false  |4+1
    // 3 "-y" besselY  | -y -x=0,100,0.1 -a=0.23           |3+1
    // 4 "-k" besselK  | -k -x=0,100,0.1 -a=0.23 -s=true   |4+1

    char besselType = getOption(argv[1]);
    if (!besselType){
        fprintf(stderr, "the first argument must be an option -j, -i, -y, -k\n");
        return -2;
    }

    double xstart;
    double xstop;
    double xdelta;
    double alpha;
    bool  exponentScale;

    switch(besselType){
        case 'i':
        case 'k':
            // -1 (for argv[0]), -1 for B. option, -1 (for x) -1 for alpha
            if (!parseScaleArgument(argc - 4, argv + 4, &exponentScale)){
              return -6;
           };
        case 'y':
        case 'j':
           // -1 (for argv[0]), -1 for B. option, (0 for exponentScale optional, so does not count)
           if (!parse2Arguments(argc - 2, argv + 2, &xstart, &xstop, &xdelta, &alpha)){
              return -4;
           }
           break;
        default:
            fprintf(stderr, "first option should be the one of -i,-j,-y,-k\n");
            return -3;
    }

    // now we have everything we need

    for (double x = xstart; x <= xstop; x+=xdelta){
        switch(besselType){
            case 'i':
            case 'k':
                printf("%.23lf,%.23lf,%c\n", x, alpha, exponentScale ? 't':'f');
                break;
            case 'y':
            case 'j':
                printf("%.23lf,%.23lf\n", x, alpha);
        }
    }

    return 0;
}
