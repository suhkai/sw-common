'use strict';

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

export { PI, cosDeg, sinDeg, mulMM, mulMV, rotate, skew, scale };
