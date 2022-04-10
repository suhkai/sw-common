double bessel_i(double x, double alpha, double expo);
double bessel_j(double x, double alpha);
double bessel_k(double x, double alpha, double expo);
double bessel_y(double x, double alpha);

#include <math.h>
#include <stdio.h>
#include <stdlib.h>

extern char **environ;

int main(int argc, char **argv) {

    int count = 0;

    printf("\n");
    while(*environ != NULL)
   {
         printf("[%s] :: \n", *(environ++));
         count++;
   }

   return 0;


}

