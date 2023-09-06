import createNS, { register } from '@mangos/debug-frontend';
import { getTextMetrics, max, round } from './tools';

import { bresenham } from './bresenham';

window.addEventListener('error',err => console.error('global error received:', err));

const canvas = document.querySelector<HTMLCanvasElement>("canvas.mycanvas")!;

const colors = [
    "hsla(45, 100%, 50%)",
    "hsla(90, 100%, 50%)",
    "hsla(120, 100%, 50%)",
]



register(prefix => ({
    send(namespace, formatter, ...args) {
        console.info(namespace + ', ' + formatter, ...args);
    },
    isEnabled(namespace){
        return true;
    }
}))

const debugRO = createNS('resize-observer');
const observer = new ResizeObserver((entries) => {
    debugRO('resize observer fired');
    if (entries.length !== 1) {
        debugRO('[there is not exactly 1 entry: %d', entries.length);
        return;
    }
    const entry: ResizeObserverEntry & { target: HTMLCanvasElement }= entries[0] as any;  // its always there
    const physicalPixelWidth = entry.devicePixelContentBoxSize[0].inlineSize;
    const physicalPixelHeight = entry.devicePixelContentBoxSize[0].blockSize;
    const height = entry.borderBoxSize[0].blockSize;
    const width = entry.borderBoxSize[0].inlineSize;
    entry.target.width = physicalPixelWidth;
    entry.target.height = physicalPixelHeight;
    const detail ={ physicalPixelWidth, physicalPixelHeight, height, width }

    debugRO('canvas size: %o', detail);
    entry.target.dispatchEvent(
        new CustomEvent('cresize', {
           detail
        })
    );
});

observer.observe(canvas, { box: 'device-pixel-content-box' });

const debugResize = createNS('canvas-cresize-event-handler');

canvas.addEventListener('cresize', (e: Event) => {
    const detail: { physicalPixelWidth, physicalPixelHeight, height, width } =  (e as any).detail;
    const { physicalPixelHeight , height } = detail;
    debugResize('height [canvas pixel height]/[css pixel height]: %s', physicalPixelHeight/height )
    const ctx = canvas.getContext("2d")!;
    // patching
    const topLine = 10;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.direction = "ltr";
    ctx.textAlign = "left";
    //ctx.textBaseline  = 'alphabetic'; // the default
   
 
    ctx.fillStyle = 'black'; //'hsla(240, 100%, 50%, 0.4)' // or choose 'black';
    const text1 = "Q³[{?fqFTjyµçGZIₛ";

    let offsety = 5;
    let offsetx = 6;
    for (let fontSize = 8; fontSize <= 44; fontSize += 2) {
        const fontShort = `${fontSize}px sans-serif`;
        offsety = drawTextAndGuides(fontShort, fontShort , ctx, offsetx, offsety, 5);
    }

    
    return;
    
});

function drawTextAndGuides(fontShortHand: string, text: string, ctx: CanvasRenderingContext2D, offsetx: number, offsety: number, spacing: number): number {
    ctx.font = fontShortHand;
    const metrics = getTextMetrics(ctx, text);
    //debug('text metrics for [%s] is %o', ctx.font, metrics);
    
    const { ascent, descent, fontAscent, fontDescent, left, right} = metrics;
    const maxHeight = round(max(fontAscent, ascent) + max(fontDescent, descent));
    
    const baseLine = round(ascent);
    /* baseLine = 3 (offset is chosen to be 0 here)
    0 
    1
    2
    3 ---
    */
    // since fractions and "in-between pixels" do not exist in descrete pixelated displays, we do the following
    //  1. round(max(fontAscent, ascent)) is the net number of pixels skipped untill a baseline is drawn
    //  2. the number of pixel skipped is the same in the ruler (to draw the baseline ind) and the text ontop of the real canvas
    //  3. baseline is also drawn on the canvas to check if the ruler and canvas are lined up correctly 
    const imd = new ImageData(4, maxHeight);
    imd.setColor(3, baseLine, 255, 0, 0, 192); // red
    imd.setColor(2, baseLine, 255, 0, 0, 192); // red
    imd.setColor(1, baseLine, 255, 0, 0, 192); // red
    imd.setColor(0, baseLine, 255, 0, 0, 192); // red
    for (let i = 1; i < round(max(ascent, fontAscent)); i++){
        if (i % 6 === 0) {
            imd.setColor(3, baseLine - i, 0, 0, 0, 192); // grey
            imd.setColor(2, baseLine - i, 0, 0, 0, 192); // grey
            imd.setColor(1, baseLine - i, 0, 0, 0, 192); // grey
            imd.setColor(0, baseLine - i, 0, 0, 0, 192); // grey
            continue;
        }
        if (i % 2 === 0) {
            imd.setColor(3, baseLine - i, 0, 0, 0, 128); // grey
            imd.setColor(2, baseLine - i, 0, 0, 0, 128); // grey
            continue;
        }
    }
    for (let i = 1; i < maxHeight - 1 -  round(max(ascent, fontAscent)); i++){
        if (i % 6 === 0) {
            imd.setColor(3, baseLine + i, 0, 0, 0, 192); // grey
            imd.setColor(2, baseLine + i, 0, 0, 0, 192); // grey
            imd.setColor(1, baseLine + i, 0, 0, 0, 192); // grey
            imd.setColor(0, baseLine + i, 0, 0, 0, 192); // grey
            continue;
        }
        if (i % 2 === 0) {
            imd.setColor(3, baseLine + i, 0, 0, 0, 128); // grey
            imd.setColor(2, baseLine + i, 0, 0, 0, 128); // grey
            continue;
        }
    }
    ctx.putImageData(imd, offsetx, offsety);
    ctx.fillText(text, offsetx + 4 - left, baseLine + offsety);
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(offsetx + 4 - left, baseLine + offsety + 0.5);
    ctx.strokeStyle = colors[0];
    ctx.lineTo(ctx.canvas.width, baseLine + + offsety + 0.5);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    

    
    // return nextOffset
    return offsety + maxHeight + spacing;
}


/*
----
.
--
.
--
.
----baseline
.
--
.
--
.
----
-10
*/




