module.exports = function intrinsicN(t, sn=3){
    const B=7.3E+15;
    const Eg = 1.12;
    const k = 8.62E-5;
    const answ = B*t**(3/2)*Math.exp(-Eg/(2*k*t));
    return answ.toExponential(sn);
}