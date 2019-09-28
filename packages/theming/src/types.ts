export type JSSObject = { [key: string]: JSSObject } | string | number | boolean | null;
export type JSSObjectTransform = (a: JSSObject) => JSSObject;