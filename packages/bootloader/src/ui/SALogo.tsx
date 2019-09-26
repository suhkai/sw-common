/*

[data-logo-svg] {
	display: block;
}

[data-logo-container] {
	height: fit-content;
	width: fit-content;
}
*/

'use strict';

import { Ref, useRef, useLayoutEffect } from 'preact/hooks';
import { mulMM, mulMV, rotate, scale } from './math';

import jssprep from './jss-local';

interface Point {
    x: number;
    y: number;
}

interface PathElt {
    c: string; // command
    data?: Point[];
}

type PathElts = PathElt[];

const pathCanon5 = [
    { c: "m", data: [{ x: -5.212, y: 9.196 }] },
    { t: 'a', c: "c", data: [{ x: 1.157, y: -0.5642 }, { x: 9.108, y: -0.524 }, { x: 10.26, y: 0.04613 }] },
    { t: 'a', c: "c", data: [{ x: 3.619, y: 1.796 }, { x: 8.593, y: 2.289 }, { x: 10.14, y: -0.3612 }] },
    { t: 'a', c: "c", data: [{ x: 1.552, y: -2.649 }, { x: -1.082, y: -6.379 }, { x: -4.624, y: -8.987 }] },
    { t: 'b', c: "c", data: [{ x: -1.054, y: -0.7877 }, { x: -5.1, y: -7.486 }, { x: -5.159, y: -8.783 }] },
    { t: 'b', c: "c", data: [{ x: -0.1929, y: -4.109 }, { x: -2.271, y: -8.755 }, { x: -5.345, y: -8.743 }] },
    { t: 'b', c: "c", data: [{ x: -3.075, y: 0.012 }, { x: -5.247, y: 4.721 }, { x: -5.401, y: 8.49 }] },
    { t: 'c', c: "c", data: [{ x: -0.04906, y: 1.313 }, { x: -4.106, y: 8.228 }, { x: -5.176, y: 8.9 }] },
    { t: 'c', c: "c", data: [{ x: -3.366, y: 2.243 }, { x: -6.251, y: 6.273 }, { x: -4.684, y: 8.935 }] },
    {
        t: 'c', c: "c", data: [{ x: 1.567, y: 2.661 }, { x: 6.619, y: 2.089 }, { x: 9.986, y: 0.5034 }]
    }];

function renderPath(path: PathElts) {
    const snippets = path.reduce((arr, instr) => {
        const { c, data } = instr;
        const snippet = `${c} ${(data && data.map(({ x, y }) => `${x},${y}`).join(' ')) || ''}`;
        arr.push(snippet);
        return arr;
    }, [] as string[]);
    return snippets.join(' ');
}

export function transformPath(m: Float32Array, p: PathElts) {
    const result = [];
    const v = new Float32Array(2);
    for (const pathElt of p) {
        if (pathElt.data) {
            const newData = [];
            for (const coords of pathElt.data) {
                v[0] = coords.x;
                v[1] = coords.y;
                const v2 = mulMV(m, v);
                newData.push({ x: prec4(v2[0]), y: prec4(v2[1]) });
            }
            result.push({ c: pathElt.c, data: newData });
        }
    }
    return result;
}

export interface SVGProps {
    angle1: number;
    angle2: number;
    angle3: number;
    scale1: number;
    scale2: number;
}

function precision(dec = 0) {
    return (n = 0) => {
        return Number.parseFloat(Number(n).toPrecision(dec));
    }
}

//const svgNS = 'http://www.w3.org/2000/svg';
const prec4 = precision(4);

export function SvgLogo(props: SVGProps) {
    const { angle1, angle2, angle3, scale1, scale2 } = props;
    const maskId = useRef(String(Math.random())); //
    const rectId = useRef(String(Math.random()));

    const pathTopLevel  = useRef<SVGPathElement>();
    const pathWhite  = useRef<SVGPathElement>();
    const pathBlack  = useRef<SVGPathElement>();

    useLayoutEffect(() => {
        const scaleI1 = scale(scale1, scale1);
        const scaleI2 = scale(scale2, scale2);
        const g = rotate(angle1);
        const i1 = rotate(angle2);
        const i2 = rotate(angle3);
        const mi = mulMM(g, mulMM(i1, scaleI1));
        const mii = mulMM(g, mulMM(i1, mulMM(i2, scaleI2)));
        const outer = transformPath(g, pathCanon5);
        const inner1 = transformPath(mi, pathCanon5);
        const inner2 = transformPath(mii, pathCanon5);
        const d1 = renderPath(outer);
        const d2 = renderPath(inner1);
        const d3 = renderPath(inner2);
        // set the paths
        //return [d1, d2, d3];
        //const [d1, d2, d3] = this.calculatePaths();
        pathWhite && pathWhite.current && pathWhite.current.setAttributeNS(null, 'd', d1);
        pathBlack && pathBlack.current && pathBlack.current.setAttributeNS(null, 'd', d2);
        pathTopLevel && pathTopLevel.current && pathTopLevel.current.setAttributeNS(null, 'd', d3);
    }, [angle1, angle2, angle3, scale1, scale2])

    return (<svg viewBox="-20 -20 40 40" shapeRendering="geometricPrecision" preserveAspectRatio="xMidYMid meet">
        <mask id={maskId.current}>
            <path ref={pathWhite as Ref<SVGPathElement>} fill="white" />
            <path ref={pathBlack as Ref<SVGPathElement>} fill="black" />
        </mask>
        <rect id={rectId.current} x={-20} y={-20} width={40} height={40} mask={`url(#${maskId.current})`} fill="#e3493c" />
        <path ref={pathTopLevel as Ref<SVGPathElement>} fill="e3493c" />
    </svg>);
};