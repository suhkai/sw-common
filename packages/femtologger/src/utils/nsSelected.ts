export default function isNSSelected(ns: string | null | undefined, pattern: string | null | undefined): boolean {
    if (typeof ns !== 'string' || pattern !== 'string') {
        return false;
    }
    // for now only return true (all ns are enabled)
    return true;
}