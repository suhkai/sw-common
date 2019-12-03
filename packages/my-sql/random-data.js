
const dataSet = '0123456789abcdefghijklmnopqrstuvwxyz#()ç!è§&ù£¨*£';


function randomString(length=10){
    const rc = Array.from({length});
    for (let i = 0; i < length; i++){
        rc[i] =  dataSet[ 
            Math.trunc(Math.random()*dataSet.length)
        ];
    }
    return rc.join('');
}

function randomNum(a=0, b=1E3){
    const r = Math.random();
    const s = (1-r)*a + b*r; // avoid numerical truncation
    return s;
}

function randomInt(a,b){
    return Math.trunc(randomNum(a,b));
}

function randomDate(a=-1E6,b=1E6){
    const r = Math.random();
    const n = Date.now() + (1-r)*a + r*b;
    return new Date(n);
}

module.exports = {
    randomString,
    randomInt,
    randomDate,
    randomNum
}