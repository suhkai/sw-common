#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>
#include <math.h>

// nan with extra info:
// A quiet NaN is represented by any bit pattern
//  between 7FF8000000000000 and 7FFFFFFFFFFFFFFF 
//  or
//  between FFF8000000000000 and FFFFFFFFFFFFFFFF
//
#define E_OUT_OF_RANGE 0x7FF8000000000001;
#define E_BESSEL_K_ALLOC_MEM 0x7FF8000000000002;

#define warning printf

static void K_bessel(double *x, double *alpha, int *nb, bool *ize, double *bk, int *ncalc)
{
        
}

double bessel_k(double x, double alpha, bool expo)
{
    if (isnan(x) || isnan(alpha))
    {
        return x+alpha;
    }
    if (x < 0)
    {
        return E_OUT_OF_RANGE;
    }
    if (alpha < 0)
    {
        alpha = -alpha;
    }

    int nb = 1+(int)floor(alpha);
    alpha -= (double)(nb-1);
    
    double *bk = calloc(nb, sizeof(double));
    if (!bk){
        return E_BESSEL_K_ALLOC_MEM;
    }

    int ncalc;
    K_bessel(&x, &alpha, &nb, &expo, bk, &ncalc);

    if(ncalc != nb)
    {/* error input */
        if(ncalc < 0)
        {
            warning("bessel_k(%g): ncalc (=%d) != nb (=%d); alpha=%g. Arg. out of range?\n",
			 x, ncalc, nb, alpha);
        }
        else
        {
            warning("bessel_k(%g,nu=%g): precision lost in result\n",
			 x, alpha+(double)nb-1);
        }
    }
    x = bk[nb-1];
    free(bk);
    return x;
}


// test the function
int main(){
   // from R
   //  >besselK(0.3, 0)
   //  >[1] 1.37246
   double answer = bessel_k(0.3, 0.0, true);
   printf("bessel => %f\n", answer);
   answer = bessel_k(NAN, 0.0, true);
   printf("bessel NaN input=> %f\n", answer);
   void *ptr = calloc(10, sizeof(int));
   printf("sizeof long:%lu\n", sizeof(long));
   printf("sizeof int:%lu\n", sizeof(int));
   printf("sizeof long long:%lu\n", sizeof(long long));
   printf("sizeof double:%lu\n", sizeof(double));
   printf("sizeof long double:%lu\n", sizeof(long double));
   printf("sizeof float:%lu\n", sizeof(float));
   free(ptr);
   return 0;
}