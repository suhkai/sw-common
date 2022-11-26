import ms from 'ms';

export function addDate(time = Date.now()){
    return new Date(time).toISOString;
}

export function addTimeDiff(timeDiff: number){
    return ms(timeDiff);
}

 
