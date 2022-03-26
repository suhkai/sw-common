double bessel_i(double x, double alpha, double expo);
double bessel_j(double x, double alpha);
//double bessel_k(double x, double alpha, double expo);
double bessel_y(double x, double alpha);

#include <math.h>
#include <stdio.h>

int main() {
    //double answer = bessel_k(0.3, 10000, 1.0 + (double) true);
    double answer = bessel_i(5, 1, 1.0);
    printf("besseli => %e\n", answer);
    answer = bessel_i(NAN, 0.0, 2.0);
    printf("besseli NaN input=> %f\n", answer);
    return 0;
}

