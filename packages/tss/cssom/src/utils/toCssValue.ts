const join = (value: string[], by: string) => {
    let index = value.indexOf('!important');
    index = index < 0 ? value.length : index;
    return value.slice(0, index).join(by);
}
const isArray = Array.isArray;

/**
 * Converts array values to string.
 * 
 * `transition: [['*', '5s', 'ease-in-out']]` > `transition: * 5s ease-in-out;`
 * `src: ['url(./font1), 'url(./font2)']` > `src: url(./font1) url(./font2);`
 * `margin: [['5px', '10px'], '!important']` > `margin: 5px 10px !important;`
 */
export default function arrayToString(value: any, ignoreImportant: boolean = false): string {
    if (!isArray(value)) return value
    if (ignoreImportant) value.push('!important');
    const temp = value.map(itm => isArray(itm) ? join(itm, ' ') : itm);
    let cutoff = temp.indexOf('!important');
    cutoff = cutoff < 0 ? temp.length: cutoff;
    return temp.slice(0, cutoff).join(', ');
}