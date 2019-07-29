'use strict'

//ugly but put all what is needed in this file

interface PathElt {
    c: string; // command
    data?: Point[];
}

interface Point {
    x: number;
    y: number;
}

type PathElts = PathElt[];


function precision(dec = 0) {
    return (n = 0) => {
        return Number.parseFloat(Number(n).toPrecision(dec));
    }
}

const svgNS =  'http://www.w3.org/2000/svg';
const prec4 = precision(4);

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

function renderPath(path: PathElts) {
    const snippets = path.reduce((arr, instr) => {
        const { c, data } = instr;
        const snippet = `${c} ${(data && data.map(({ x, y }) => `${x},${y}`).join(' ')) || ''}`;
        arr.push(snippet);
        return arr;
    }, [] as string[]);
    return snippets.join(' ');
}


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

const PI = Math.PI;
const _Dfactor = PI / 180;
const cosDeg = (phi: number) => Math.cos(phi * _Dfactor);
const sinDeg = (phi: number) => Math.sin(phi * _Dfactor);

function mulMM(a: Float32Array, b: Float32Array): Float32Array {
    /*
              +--------+
              |0      2|
              |        |
              |1      3|
              +--------+
    +------------------+
    |0      2||0      2|
    |        ||        |
    |1      3||1      3|
    +------------------+
    */
    const rc = new Float32Array(6);
    rc[0] = a[0] * b[0] + a[2] * b[1];
    rc[1] = a[1] * b[0] + a[3] * b[1];
    rc[2] = a[0] * b[2] + a[2] * b[3];
    rc[3] = a[1] * b[2] + a[3] * b[3];
    rc[4] = a[4] + b[4];
    rc[5] = a[5] + b[5];

    return rc;
}

function mulMV(a: Float32Array, b: Float32Array): Float32Array {
    /*
           +---+
           | 0 |
           |   |
           | 1 |
+----------+---+
|0   2   4|  0
|         |
|1   3   5|  1
+---------+

    */
    const rc = new Float32Array(2);
    rc[0] = a[0] * b[0] + a[2] * b[1] + a[4];
    rc[1] = a[1] * b[0] + a[3] * b[1] + a[5];
    return rc;
}


function rotate(rho: number): Float32Array {
    const cos = cosDeg(rho);
    const sin = sinDeg(rho);
    // column first
    const m33 = new Float32Array([
        cos, sin, -sin, cos, 0, 0
    ]);
    return m33;
}

function skew(ratio1: number, ratio2: number): Float32Array {
    // ratio1 = dy/dx   ratio2 = dx/dy, aka  x' = x + dx/dy*y
    const m33 = new Float32Array([
        1, ratio1, ratio2, 1, 0, 0
    ]);
    return m33;
}

function translate(tx: number, ty: number): Float32Array {
    const m33 = new Float32Array([
        1, 0, 0, 1, tx, ty
    ]);
    return m33;
}

function scale(sx: number, sy: number): Float32Array {
    const m33 = new Float32Array([
        sx, 0, 0, sy, 0, 0
    ]);
    return m33;
}

const ran = () => Math.trunc(Math.random() * 1000);

export default class SALogo {
    private angle1: number;
    private angle2: number;
    private angle3: number;
    private scale1: number;
    private scale2: number;
    private $self?: SVGElement;
    private $rect?: SVGRectElement;
    private $pathWhite?: SVGPathElement;
    private $pathBlack?: SVGPathElement;
    private $pathTopLevel?: SVGPathElement;

    constructor(angle1 = 0, angle2 = 0, angle3 = 0, scale1 = 0.8, scale2 = 0.5) {
        this.angle1 = angle1;
        this.angle2 = angle2;
        this.angle3 = angle3;
        this.scale1 = scale1;
        this.scale2 = scale2;
        // create svg template
    }

    // creates the svg and mounts it
    mount($mp: HTMLElement) {
      
        const svg = this.$self = window.document.createElementNS(svgNS, 'svg');

        svg.setAttributeNS(null, 'viewBox', '-20 -20 40 40');
        svg.setAttributeNS(null, 'shapeRendering', 'geometricPrecision');
        svg.setAttributeNS(null, 'xlink', 'http://www.w3.org/1999/xlink' )
     
        //mask
        const mask = window.document.createElementNS(svgNS, 'mask');
        const $maskId = `edges-${ran()}-${ran()}`;
        mask.setAttribute('id', $maskId);
        const pathWhite = this.$pathWhite = window.document.createElementNS(svgNS, 'path');
        const pathBlack = this.$pathBlack = window.document.createElementNS(svgNS, 'path');
        pathWhite.setAttributeNS(null, 'fill', 'white');
        pathBlack.setAttributeNS(null, 'fill', 'black');
        mask.appendChild(pathWhite);
        mask.appendChild(pathBlack);
        //rect
        const $rectId = `final-${Math.random()}`;
        const rect = this.$rect = window.document.createElementNS(svgNS, 'rect');
        rect.setAttribute('id', $rectId);
        rect.setAttributeNS(null, 'x', '-20');
        rect.setAttributeNS(null, 'y', '-20');
        rect.setAttributeNS(null, 'width', '40');
        rect.setAttributeNS(null, 'height', '40');
        rect.setAttributeNS(null, 'mask', `url(#${$maskId})`);
        rect.setAttributeNS(null, 'fill', `#e3493c`);

        const pathTopLevel = this.$pathTopLevel = window.document.createElementNS(svgNS, 'path');
        //pathTopLevel.setAttributeNS(null, 'd', '');
        pathTopLevel.setAttributeNS(null, 'fill', '#e3493c');

        // compose final structure
        this.$self.appendChild(mask);
        this.$self.appendChild(rect);
        this.$self.appendChild(pathTopLevel);
        $mp.appendChild(this.$self);
        this.render();
    };

    // removed the svg (does this ever happen?)
    unmount() {
        if (this.$self) {
            this.$self.parentNode && this.$self.parentNode.removeChild(this.$self);
            // detach any event Listeners
        }
    }

    calculatePaths() {
        // we want to make this alterable, for now constants
        const scaleI1 = scale(this.scale1, this.scale1);
        const scaleI2 = scale(this.scale2, this.scale2);
        const g = rotate(this.angle1);
        const i1 = rotate(this.angle2);
        const i2 = rotate(this.angle3);
        const mi = mulMM(g, mulMM(i1, scaleI1));
        const mii = mulMM(g, mulMM(i1, mulMM(i2, scaleI2)));
        const outer = transformPath(g, pathCanon5);
        const inner1 = transformPath(mi, pathCanon5);
        const inner2 = transformPath(mii, pathCanon5);
        const d1 = renderPath(outer);
        const d2 = renderPath(inner1);
        const d3 = renderPath(inner2);
        return [d1, d2, d3];
    }

    render() {
        const [d1, d2, d3] = this.calculatePaths();
        this.$pathWhite && this.$pathWhite.setAttributeNS(null, 'd', d1);
        this.$pathBlack && this.$pathBlack.setAttributeNS(null, 'd', d2);
        this.$pathTopLevel && this.$pathTopLevel.setAttributeNS(null, 'd', d3);
    }
}

