const canvas = document.querySelector("canvas.mycanvas");
const ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, 300, 150);

const text = "Q³[{?fqFTjyµç";
const baseLinePosition = 50;
const offsetX = 5;

ctx.fillStyle="black";
ctx.direction = "ltr";
ctx.font = "48px serif";
ctx.textAlign = "left";

const textMetric = ctx.measureText(text);
console.log(textMetric);

const {  
    width,
    actualBoundingBoxAscent,
    actualBoundingBoxDescent,
    actualBoundingBoxLeft,
    actualBoundingBoxRight,
    fontBoundingBoxAscent,
    fontBoundingBoxDescent,
} = textMetric
ctx.baseLinePosition = "alphabetic";
ctx.fillText(text, offsetX, baseLinePosition);


const totalWidth = actualBoundingBoxRight - actualBoundingBoxLeft
const endOfBox = Math.round(offsetX + totalWidth);
//+ width 
 //+ actualBoundingBoxRight;
console.log(`actualBoundingBoxLeft ${actualBoundingBoxLeft}`);
console.log(`actualBoundingBoxRight ${actualBoundingBoxRight}`);
console.log(`width ${width}`);
console.log(`total width is ${totalWidth}px`); // this is the total width

// draw baseline (its one pixel below the baseline, to prevent overwriting the text)
ctx.beginPath();
ctx.strokeStyle = "hsla(45, 100%, 50%, 0.5)";
ctx.strokeWidth = 1;
ctx.moveTo(offsetX,  baseLinePosition + 0.5);
ctx.lineTo(endOfBox, baseLinePosition + 0.5);
ctx.closePath();
ctx.stroke(); // Render the path

// draw ascent (1 pixel above the ascent line )
const ascentLine =  Math.round(baseLinePosition - actualBoundingBoxAscent) - 0.5;
ctx.beginPath();
ctx.strokeStyle = "hsla(90, 100%, 50%, 0.5)";
ctx.strokeWidth = 1;
// 
ctx.moveTo(offsetX, ascentLine);
ctx.lineTo(endOfBox, ascentLine);
ctx.closePath();
ctx.stroke(); // Render the path

// draw descent (1 pixel below the descent line )
const descentLine =  Math.round(baseLinePosition + actualBoundingBoxDescent) + 0.5;
ctx.beginPath();
ctx.strokeStyle = "hsla(120, 100%, 50%, 0.5)";
ctx.strokeWidth = 1;
// 
ctx.moveTo(offsetX, descentLine);
ctx.lineTo(endOfBox, descentLine);
ctx.closePath();
ctx.stroke(); // Render the path
ctx.fillRect(0,0,1,1);
/*
   width = 63.984375
   actualBoundingBoxAscent = 34
   actualBoundingBoxDescent = 0
   actualBoundingBoxLeft = 0
   actualBoundingBoxRight = 59
   fontBoundingBoxAscent = 43  // not on my firefox
   fontBoundingBoxDescent = 10 // not on my firefox
*/
const imageData = ctx.getImageData(0,0,10,10);
console.log(imageData.data);
// lets set a color
imageData.data[0] = 255;
imageData.data[2] = 255;
imageData.data[3] = 128;

imageData.data[5+40] = 255;
imageData.data[6+40] = 128;
imageData.data[7+40] = 128;


console.log(imageData.data);

ctx.putImageData(imageData,0,0);


