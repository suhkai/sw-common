/*
 *  Mathlib : A C Library of Special Functions
 *  Copyright (C) 1998-2014 Ross Ihaka and the R Core team.
 *  Copyright (C) 2002-3    The R Foundation
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, a copy is available at
 *  https://www.R-project.org/Licenses/
 */



/*  DESCRIPTION --> see below */


/* From http://www.netlib.org/specfun/rkbesl	Fortran translated by f2c,...
 *	------------------------------=#----	Martin Maechler, ETH Zurich
 */

#include <stdio.h> 
#include <math.h>
#include <float.h>  // for DBL_MIN

#include "./bessel.h"
#include "./nmath2.h"

#define MATHLIB_WARNING(fmt,x)		warning(fmt,x)
#define ISNAN(x) (isnan(x)!=0)
#define min0(x, y) (((x) <= (y)) ? (x) : (y))
#define max0(x, y) (((x) <= (y)) ? (y) : (x))
#define ME_NOCONV	4


void K_bessel(
	double *x,
	double *alpha,
	int *nb,
	int *ize,
	double *bk,
	int *ncalc
	)
{
	return;
//
}

double bessel_k(double x, double alpha, double expo)
{
    int nb, ncalc, ize;
    double *bk;

    /* NaNs propagated correctly */
    if (ISNAN(x) || ISNAN(alpha))
	{
		return x + alpha;
	}

    if (x < 0)
	{
		ML_WARNING(ME_RANGE, "bessel_k");
		return ML_NAN;
    }

    ize = (int)expo;
    
	if(alpha < 0)
	{
		alpha = -alpha;
	}

    nb = 1+ (int)floor(alpha);/* nb-1 <= |alpha| < nb */
    alpha -= (double)(nb-1);
    // nb is upper limit for alpha trunc(alpha)+1
    // then becomes nb-1,
    // substract nb-1 from alpha, so  -1 <= |alpha|-nb < 0
    //  0 <= |alpha| -nb+1 < 1
    //  0 <= |alpha| -(nb-1) < 1

	bk = (double *) calloc(nb, sizeof(double));
	if (!bk) 
	{
		MATHLIB_ERROR("%s", _("bessel_k allocation error"));
	}

    /*K_bessel(&x, &alpha, &nb, &ize, bk, &ncalc);

	if(ncalc != nb) // error input
	{ 
		if(ncalc < 0)
		{
			MATHLIB_WARNING4(_("bessel_k(%g): ncalc (=%d) != nb (=%d); alpha=%g. Arg. out of range?\n"), x, ncalc, nb, alpha);
		}
		else
		{
			MATHLIB_WARNING2(_("bessel_k(%g,nu=%g): precision lost in result\n"),x, alpha+(double)nb-1);
		}
	}
    x = bk[nb-1];*/
    free(bk);
    return x;
}

