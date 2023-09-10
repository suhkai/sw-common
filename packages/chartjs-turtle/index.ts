import createNS, { register } from '@mangos/debug-frontend';

const canvas = document.querySelector('canvas')!;

 
register(prefix => ({
    send(namespace, formatter, ...args) {
        console.info(namespace + ', ' + formatter, ...args);
    },
    isEnabled(namespace){
        return true;
    }
}));
 
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

    debugRO('physicalPixelWidth: %s,\tphysicalPixelHeight: %s,\twidth: %s,\theight: %s', 
      String(physicalPixelWidth).padStart(5,'0'),
      String(physicalPixelHeight).padStart(5,'0'),
      String(height).padStart(5,'0'),
      String(width).padStart(5,'0'),  
    );
    entry.target.dispatchEvent(
        new CustomEvent('cresize', {
           detail
        })
    );
});

observer.observe(canvas, { box: 'device-pixel-content-box' });
