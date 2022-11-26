import getLineInfo from './getLineInfo';
import type { LineInfo } from './getLineInfo';
import isBrowser from './utils/isBrowser';
import trueOrFalse from './utils/trueOrfalse';
import isNSSelected from './utils/nsSelected';
import { getNodeConfig, setNodeConfig} from './config';


// types and interfaces

interface Formatters {
    [formatter: string]: (v: any) => string;
}

// run all inits again


export interface NSInfo {
    enabled: boolean
    reInit: () => void
    color: number // index into 256 palette
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
const nsMap = new Map<string, NSInfo>();

export function evalAllNS() {
    for (const info of nsMap.values()) {
        info.reInit();
    }
}



function createNs(ns: string): Printer {

    // closure vars
    let nsInfo: NSInfo | undefined;
    let lastTime: number = 0;
    let showDate: boolean;
    let useColors: boolean;
    const web = isBrowser();


    function isEnabled(): boolean {
        showDate = false;
        if (web) {
            let nsSelection = isNSSelected(ns, globalThis.localStorage.getItem('DEBUG')); // namespace comma separated list
            let hideDate = trueOrFalse(globalThis.localStorage.getItem('DEBUG_HIDE_DATE'), true);
            useColors = trueOrFalse(globalThis.localStorage.getItem('DEBUG_COLORS'), true);

            // don't use date with colors
            if (hideDate === false) {
                useColors = false;
            }
            showDate = !hideDate;
            return nsSelection;
        }
        else {
            // node, 
            const config = getNodeConfig();
            // we take from memory first
            if (config.namespaces !== '') {
                let nsSelection = isNSSelected(ns, config.namespaces);
                if (config.showDate === true) {
                    useColors = false;
                }
                return nsSelection;
            }
            // otherwise check env vars
            const nsSelectionPattern = process.env['DEBUG'];
            let nsSelection = isNSSelected(ns, process.env['DEBUG']); // namespace comma separated list
            let hideDate = trueOrFalse(process.env['DEBUG_HIDE_DATE'], true);
            useColors = trueOrFalse(process.env['DEBUG_COLORS'], true);
            if (hideDate === false) {
                useColors = false;
            }
            showDate = !hideDate;
            // update cache from readonly env vars
            setNodeConfig({ namespaces: nsSelectionPattern, showDate, useColors });
            return nsSelection;
        }
    }

    function init(): void {
        const enabled = isEnabled();
        nsInfo = nsMap.get(ns);
        // first time being called
        if (nsInfo === undefined) {
            nsInfo = {
                enabled,
                reInit: () => init(),
                color: 5 // use random color from 256 color palette
            };
            Object.defineProperty(nsInfo, 'color', {
                configurable: false,
                enumerable: true,
                value: nsInfo.color,
                writable: false
            });
            nsMap.set(ns, nsInfo);
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
            if (matches.length !== args.length) {
                throw new Error('Number of variable arguments must match number of format specifiers (%)');
            }
            const interpolated: string[] = [];
            let i = 0;
            do {
                const start: number = i > 0 ? (matches[i - 1]?.index || 0 as number) + 2 : 0;
                const stop: number = (matches[i]?.index) as number;
                if (start !== stop) {
                    interpolated.push(formatter.slice(start, stop));
                }
                // push stringified value from args[i] according to matches[i]  
                i++;
            } while (i < matches.length);
            // is there a piece of text after the last (%.)?
            const last: number = (matches[matches.length]?.index as number || 0 as number) + 2;
            if (formatter.length > last) {
                interpolated.push(formatter.slice(last, formatter.length));
            }
            const output = interpolated.join('');

        }; // printer object needs
        // TODO: add these properties
        // color: string;
        //      specific color for this namespace
        // diff: number;
        //      last time this namespace was used
        //  enabled (getter/setter)
        //      if this namespace is enabled or not
        // namespace of this printer
        //      actual namespace of this printer
        return printer as Printer;
    }
    return createPrinter();
}

export { createNs as debug };
export { createNs as default };

