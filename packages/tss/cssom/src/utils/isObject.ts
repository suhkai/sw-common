export default function isObject(a: any): a is Object {
    if (a === undefined || a === null) return false;
    return (a).constructor === {}.constructor
}
