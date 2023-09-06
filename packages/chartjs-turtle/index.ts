import Chart from 'chart.js/auto';
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
/*
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
*/

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });