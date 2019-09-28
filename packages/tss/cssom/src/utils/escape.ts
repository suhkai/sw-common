const regexp = /([[\].#*$><+~=|^:(),"'`\s])/g;
const hasCSS = typeof CSS === 'undefined';
const escapePoly = (str: string) => str.replace(regexp, '\\$1');
const escape  = (str: string) => hasCSS ? CSS.escape(str) : escapePoly(str);
export default escape;
