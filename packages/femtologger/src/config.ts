import isBrowser from './utils/isBrowser';
import { evalAllNS } from './index';

// globals
const nodeConfig = {
    namespaces: '', // what namespaces to show;
    showDate: false,
    useColors: true,
    web: isBrowser(),
}

export function setNodeConfig(options: Partial<typeof nodeConfig>) {
    let changed = 0; 
    if (options?.namespaces && nodeConfig.namespaces !== options?.namespaces){
        // validate namespaces before altering
        nodeConfig.namespaces = options.namespaces;
        changed++;
    }
    if (options?.showDate && nodeConfig.showDate !== options?.showDate){
        nodeConfig.showDate = options.showDate;
        changed++;
    }
    if (options?.useColors && nodeConfig.useColors !== options?.useColors){
        nodeConfig.useColors = options.useColors;
        changed++;
    }
    if (changed > 0){
        evalAllNS();
    }
    return changed > 0;
}


export function getNodeConfig(): typeof nodeConfig {
    const rc = {};
    Object.defineProperties(rc, {
        namespaces: {
            enumerable: true,
            writable: false,
            value: nodeConfig.namespaces
        },
        showDate: {
            enumerable: true,
            writable: false,
            value: nodeConfig.showDate
        },
        web: {
            enumerable: true,
            writable: false,
            value: nodeConfig.web
        }
    });
    return rc as unknown as typeof nodeConfig;
}