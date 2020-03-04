const exp = e => Number(e).toExponential(3);

const nInstrinsic = require('./f3.2');
{
   /* console.log('exercise 3.2')

    const ni = nInstrinsic(350);
    const ND = 10**17;
    const pn = ni**2/ND;
    console.log(`electron concentration pn: ${Number(ND).toExponential(3)}`);
    console.log(`hole concentration pn: ${Number(pn).toExponential(3)}`);*/
}

{
    console.log('exercise 3.3')

    const ni = nInstrinsic(300);
    console.log(`ni ${ni}`);
    console.log(`ni^2 ${exp(ni**2)}`);
    const NA = (ni**2)/Math.pow(10,6);
    console.log(`Na doping concentration must be; ${Number(NA).toExponential(3)}`);
}