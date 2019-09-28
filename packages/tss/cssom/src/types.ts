
export type JssValue =
| string
| number
| Array<string | number | Array<string | number> | '!important'>
| Object
| null
| false;

export type JssStyle = { [index: string]: Object } | { [index: string]: JssStyle };

export type _ToCssOptions = {
    indent: number,
    allowEmpty: boolean,
    children: boolean
}

export type ToCssOptions = Partial<_ToCssOptions>;