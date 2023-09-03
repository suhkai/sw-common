(() => {
  // node_modules/@mangos/debug-frontend/dist/index.js
  var a = {
    send(e, t, ...n) {
    },
    isEnabled(e) {
      return false;
    }
  };
  var r = a;
  function u(e, t) {
    return r = e(t), r;
  }
  function s(e) {
    function t(n, ...l) {
      r.isEnabled(e) && r.send(e, n, ...l);
    }
    return Object.defineProperties(t, {
      enabled: {
        get() {
          return r.isEnabled(e);
        },
        enumerable: true
      },
      namespace: {
        value: e,
        enumerable: true,
        writable: false
      }
    }), t;
  }

  // tools.ts
  var { max, round } = Math;
  ImageData.prototype.setColor = function setColor(x, y, r2, g, b, a2 = 255) {
    const offset = y * this.width + x << 2;
    this.data[offset + 0] = r2;
    this.data[offset + 1] = g;
    this.data[offset + 2] = b;
    this.data[offset + 3] = a2;
  };
  ImageData.prototype.drawHLine = function drawHLine(y, colors2) {
    const width = this.width;
    for (let i = 0; i < width; i++) {
      const color = colors2[i % colors2.length];
      this.setColor(i, y, ...color);
    }
  };
  ImageData.prototype.drawVLine = function drawVLine(x, colors2) {
    const height = this.height;
    for (let i = 0; i < height; i++) {
      const color = colors2[i % colors2.length];
      this.setColor(x, i, ...color);
    }
  };
  ImageData.prototype.drawGrid = function drawGrid(dx, dy, color) {
    for (let i = 0; i < this.height; i += dy) {
      this.drawHLine(i - 1, ...color);
    }
    for (let i = 0; i < this.width; i += dx) {
      this.drawVLine(i - 1, ...color);
    }
  };
  function getTextMetrics(ctx, text) {
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
      fontBoundingBoxDescent: fontDescent
      // not generally supported
      //emHeightAscent, // https://caniuse.com/?search=emHeightAscent%20
      //emHeightDescent, // https://caniuse.com/?search=emHeightDescent
      //hangingBaseline, // https://caniuse.com/?search=hangingBaseline%20
      //alphabeticBaseline, // https://caniuse.com/?search=alphabeticBaseline
      //ideographicBaseline, // https://caniuse.com/?search=ideographicBaseline
    } = textMetric;
    return { width, ascent, descent, fontAscent, fontDescent, left, right };
  }

  // index.ts
  window.addEventListener("error", (err) => console.error("global error received:", err));
  var canvas = document.querySelector("canvas.mycanvas");
  var debug = console.info;
  var colors = [
    "hsla(45, 100%, 50%)",
    "hsla(90, 100%, 50%)",
    "hsla(120, 100%, 50%)"
  ];
  var debugRO = s("resize-observer");
  u((prefix) => ({
    send(namespace, formatter, ...args) {
      console.info(namespace + ", " + formatter, ...args);
    },
    isEnabled(namespace) {
      return true;
    }
  }));
  var observer = new ResizeObserver((entries) => {
    debug("resize observer fired");
    if (entries.length !== 1) {
      debug("[there is not exactly 1 entry: %d", entries.length);
      return;
    }
    const entry = entries[0];
    const physicalPixelWidth = entry.devicePixelContentBoxSize[0].inlineSize;
    const physicalPixelHeight = entry.devicePixelContentBoxSize[0].blockSize;
    const height = entry.borderBoxSize[0].blockSize;
    const width = entry.borderBoxSize[0].inlineSize;
    entry.target.width = physicalPixelWidth;
    entry.target.height = physicalPixelHeight;
    const detail = { physicalPixelWidth, physicalPixelHeight, height, width };
    debug("canvas size: %o", detail);
    entry.target.dispatchEvent(
      new CustomEvent("cresize", {
        detail
      })
    );
  });
  observer.observe(canvas, { box: "device-pixel-content-box" });
  var debugResize = s("canvas-cresize-event-handler");
  canvas.addEventListener("cresize", (e) => {
    const detail = e.detail;
    const { physicalPixelHeight, height } = detail;
    debugResize("height [canvas pixel height]/[css pixel height]: %s", physicalPixelHeight / height);
    const ctx = canvas.getContext("2d");
    const topLine = 10;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.direction = "ltr";
    ctx.textAlign = "left";
    ctx.fillStyle = "black";
    const text1 = "Q\xB3[{?fqFTjy\xB5\xE7GZI\u209B";
    let offsety = 5;
    let offsetx = 6;
    for (let fontSize = 8; fontSize <= 44; fontSize += 2) {
      const fontShort = `${fontSize}px sans-serif`;
      offsety = drawTextAndGuides(fontShort, fontShort, ctx, offsetx, offsety, 5);
    }
    return;
  });
  function drawTextAndGuides(fontShortHand, text, ctx, offsetx, offsety, spacing) {
    ctx.font = fontShortHand;
    const metrics = getTextMetrics(ctx, text);
    const { ascent, descent, fontAscent, fontDescent, left, right } = metrics;
    const maxHeight = round(max(fontAscent, ascent) + max(fontDescent, descent));
    const baseLine = round(ascent);
    const imd = new ImageData(4, maxHeight);
    imd.setColor(3, baseLine, 255, 0, 0, 192);
    imd.setColor(2, baseLine, 255, 0, 0, 192);
    imd.setColor(1, baseLine, 255, 0, 0, 192);
    imd.setColor(0, baseLine, 255, 0, 0, 192);
    for (let i = 1; i < round(max(ascent, fontAscent)); i++) {
      if (i % 6 === 0) {
        imd.setColor(3, baseLine - i, 0, 0, 0, 192);
        imd.setColor(2, baseLine - i, 0, 0, 0, 192);
        imd.setColor(1, baseLine - i, 0, 0, 0, 192);
        imd.setColor(0, baseLine - i, 0, 0, 0, 192);
        continue;
      }
      if (i % 2 === 0) {
        imd.setColor(3, baseLine - i, 0, 0, 0, 128);
        imd.setColor(2, baseLine - i, 0, 0, 0, 128);
        continue;
      }
    }
    for (let i = 1; i < maxHeight - 1 - round(max(ascent, fontAscent)); i++) {
      if (i % 6 === 0) {
        imd.setColor(3, baseLine + i, 0, 0, 0, 192);
        imd.setColor(2, baseLine + i, 0, 0, 0, 192);
        imd.setColor(1, baseLine + i, 0, 0, 0, 192);
        imd.setColor(0, baseLine + i, 0, 0, 0, 192);
        continue;
      }
      if (i % 2 === 0) {
        imd.setColor(3, baseLine + i, 0, 0, 0, 128);
        imd.setColor(2, baseLine + i, 0, 0, 0, 128);
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
    ctx.lineTo(ctx.canvas.width, baseLine + +offsety + 0.5);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    return offsety + maxHeight + spacing;
  }
})();
