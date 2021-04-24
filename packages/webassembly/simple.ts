declare function log(arg0: f64): f64;
declare function exp(arg0: f64): f64;

export function calcTinyN(
    sum:f64, 
    term:f64,
    p:f64,
    xr: f64,
    xend:f64,
    xb:f64,
    NB: f64,
    NR: f64,
    ) : f64 {

    while (sum < p && xr< xend) {
        xr++;
        NB++;
        term += (NR / xr) * ( xb / NB);
        sum += term;
        xb--;
        NR--;
    }
    return xr;
}

export function calcBigN(
    sum:f64, 
    term:f64,
    p:f64,
    xr: f64,
    xend:f64,
    xb:f64,
    NB: f64,
    NR: f64,
    ) : f64 {

    while (sum < p && xr< xend) {
        xr++;
        NB++;
        term +=  log((NR / xr) * (xb /NB));
        sum += exp(term);
        xb--;
        NR--;
    }
    return xr;
}
