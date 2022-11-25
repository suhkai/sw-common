import getLineInfo from './getLineInfo';
import type { LineInfo } from './getLineInfo';
import isBrowser from './isBrowser';


// types and interfaces
interface NSInfo {
    enabled: boolean
    reInit: () => void
    color: number // index into 256 palette
}

interface Formatters {
    [formatter: string]: (v: any) => string;
}

interface Printer {
    (formatter: string, ...args: any[]): void;
    // assigned color
    color: string;
    // time difference for this printer
    diff: number;
    // enabled (getter/setter)
    enabled: boolean;
    // namespace of this printer
    namespace: string;
}

// globals
const map = new Map<string, NSInfo>();
const web = isBrowser();
const nodeConfig = {
    namespaces: '', // what namespaces to show;
    showDate: false
}
// const paletteSize (number of colors)
// device (browser console or tty screen);
// pickColor function (round robin way, complementary palettes mind you); 
const deviceOutput = (data: string, color: number){

}

function getDeviceOutput(){
    return (data: string, color: number);
}

export function setNodeConfig(options: Partial<typeof nodeConfig>) { 
    if (options?.namespaces && nodeConfig.namespaces !== options?.namespaces){
        // validate namespaces before altering
        nodeConfig.namespaces = options.namespaces;
    }
    if (options?.showDate && nodeConfig.showDate !== options?.showDate){
        nodeConfig.showDate = options.showDate;
    }
    // run all inits again
    for (const info of map.values()) {
        info.reInit();
    }
}

export function getNodeConfig() {
    return Object.assign({}, nodeConfig );
}

export { createNs as debug };
export { createNs as default };


function createNs(ns: string): () => Printer {

    // closure vars
    let nsInfo: NSInfo | undefined;
    let lastTime: number = 0;

    function isEnabled(): boolean {
        if (web) {
            // check localStorage for settings
        }
        else if (nodeConfig.namespaces) {
            // check latest config settings for this specific ns namespace
            return true
        }
        else {
            // check environment vars, copy to latest
        }
        return false;
    }

    function init(): void {
        const enabled = isEnabled();
        nsInfo = map.get(ns);
        // first time being called
        if (nsInfo === undefined) {
            nsInfo = {
                enabled,
                reInit: () => init(),
                color: 5 // use random color from 256 color palette
            };
            Object.defineProperty(nsInfo, 'color',{
                configurable: false,
                enumerable: true,
                value: nsInfo.color, 
                writable: false
            });
            map.set(ns, nsInfo);
            return;
        }
        // subsequent updates via calling "reInit"
        if (nsInfo.enabled !== enabled) {
            nsInfo.enabled = enabled;
        }
    }


    init();

    const regExp = /(%[A-Za-z]{1})/g;
    function createPrinter(): Printer {
        let diff = 0;
        function printer(formatter: string, ...args: any[]): void {
            const now = Date.now();
            if (lastTime > 0) {
                diff = now - lastTime;
            }
            lastTime = now;
            if (false === (nsInfo as NSInfo).enabled) {
                return; // skip
            }
            // use
            // nsInfo.color
            // interpolate
            const matches = Array.from(formatter.matchAll(regExp));
            if (matches.length !== args.length){
                throw new Error('Number of variable arguments must match number of format specifiers (%)');
            }
            const interpolated: string [] =[];
            let i = 0;
            do {
                const start: number = i > 0 ? (matches[i-1]?.index || 0 as number) + 2 : 0;
                const stop: number = (matches[i]?.index) as number;
                if (start !== stop) {
                    interpolated.push(formatter.slice(start, stop));
                }
                // push stringified value from args[i] according to matches[i]  
                i++;
            } while (i < matches.length);
            // is there a piece of text after the last (%.)?
            const last: number = (matches[matches.length]?.index as number || 0 as number) + 2;
            if (formatter.length > last){
                interpolated.push(formatter.slice(last, formatter.length));
            }    
            const output = interpolated.join('');

        };  
        // get random color for this n fix it for this printer
       
        // 
        return printer as Printer;

        
        // format arguments and print them 
    }

    return createPrinter();
}