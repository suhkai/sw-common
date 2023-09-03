
declare global {
  interface ImageData {
    setColor(x: number,y: number, r: number,g: number,b: number, a: number): void;
    drawHLine(y: number, colors: number[][]);
    drawVLine(x: number, colors: number[][]);
    drawGrid(dx: number, dy: number, color: number[][]);
  }
}

export const { max, round } = Math;

ImageData.prototype.setColor = function setColor(x: number,y: number, r: number,g: number,b: number, a = 255) {
    const offset = (y * this.width + x) << 2;
    this.data[offset+0] = r;
    this.data[offset+1] = g;
    this.data[offset+2] = b;
    this.data[offset+3] = a;
}

ImageData.prototype.drawHLine = function drawHLine(y: number, colors: number[][]) {
    const width = this.width;
    for (let i = 0; i < width; i++){
        const color = colors[i % colors.length];
        this.setColor(i, y, ...color);
    }
}

ImageData.prototype.drawVLine = function drawVLine(x: number, colors: number[][]) {
    const height = this.height;
    for (let i = 0; i < height; i++){
        const color = colors[i % colors.length];
        this.setColor(x, i, ...color);
    }
}

ImageData.prototype.drawGrid = function drawGrid(dx: number, dy: number, color: number[][]) {
    // draw H lines
    for (let i = 0; i < this.height; i += dy){
        this.drawHLine(i - 1, ...color);
    }
    // draw V lines
    for (let i = 0; i < this.width; i += dx){
        this.drawVLine(i - 1, ...color);
    }
}


export const HSLToRGB = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
};

export function getTextMetrics(ctx: CanvasRenderingContext2D, text: string){
    const textMetric = ctx.measureText(text);

    const {  
        //the width of a segment of inline text in CSS pixels.
        width, 

        /*
    Returns the distance from the horizontal line indicated by the
        CanvasRenderingContext2D.textBaseline attribute to the top of the 
        bounding rectangle used to render the text, in CSS pixels.
        */
    
        actualBoundingBoxAscent: ascent,

        /*
        Returns the distance from the horizontal line indicated by the
        CanvasRenderingContext2D.textBaseline attribute to the bottom 
        of the bounding rectangle used to render the text, in CSS pixels.
        */
        actualBoundingBoxDescent: descent,

        /*
            Distance parallel to the baseline from the alignment point given 
            by the CanvasRenderingContext2D.textAlign property
            to the left side of the bounding rectangle of the given text,
            in CSS pixels; positive numbers indicating a distance going left from 
            the given alignment point.
            */
        actualBoundingBoxLeft: left,

        /**
         * 
         * Returns the distance from the alignment point given by the 
         * CanvasRenderingContext2D.textAlign property to the right side of the
         *  bounding rectangle of the given text, in CSS pixels.
         *  The distance is measured parallel to the baseline.
         */

        actualBoundingBoxRight: right,

        /*
        The read-only fontBoundingBoxAscent property of the TextMetrics interface returns
        the distance from the horizontal line indicated by the 
        CanvasRenderingContext2D.textBaseline attribute,
        to the top of the highest bounding rectangle of 
        all the fonts used to render the text, in CSS pixels.
        */
        fontBoundingBoxAscent: fontAscent,
        /*
        The read-only fontBoundingBoxDescent property of the TextMetrics interface returns 
        the distance from the horizontal line indicated by the CanvasRenderingContext2D.textBaseline attribute to the bottom of the bounding rectangle of all the fonts used to render the text, in CSS pixels.
        */
        fontBoundingBoxDescent: fontDescent,

        // not generally supported
        //emHeightAscent, // https://caniuse.com/?search=emHeightAscent%20
        //emHeightDescent, // https://caniuse.com/?search=emHeightDescent
        //hangingBaseline, // https://caniuse.com/?search=hangingBaseline%20
        //alphabeticBaseline, // https://caniuse.com/?search=alphabeticBaseline
        //ideographicBaseline, // https://caniuse.com/?search=ideographicBaseline
    } = textMetric;

    return { width, ascent, descent, fontAscent, fontDescent, left, right };
}