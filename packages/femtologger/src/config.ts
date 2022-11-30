import isBrowser from './utils/isBrowser.js';
import { evalAllNS } from './index.js';

export type NodeConfig = {
  namespaces?: string | null;
  showDate: boolean;
  useColors: boolean;
  web: boolean;
};
// globals
const nodeConfig: NodeConfig = {
  namespaces: undefined, // what namespaces to show;
  showDate: false,
  useColors: true,
  web: isBrowser(),
};

export function setNodeConfig(options: Partial<NodeConfig>) {
  let changed = 0;
  if (
    options.namespaces !== undefined &&
    nodeConfig.namespaces !== options.namespaces
  ) {
    // validate namespaces before altering
    nodeConfig.namespaces = options.namespaces;
    changed++;
  }
  if (
    options.showDate !== undefined &&
    nodeConfig.showDate !== options.showDate
  ) {
    nodeConfig.showDate = options.showDate;
    changed++;
  }
  if (
    options.useColors !== undefined &&
    nodeConfig.useColors !== options.useColors
  ) {
    nodeConfig.useColors = options.useColors;
    changed++;
  }
  if (changed > 0) {
    evalAllNS();
  }
  return changed > 0;
}

export function getNodeConfig(): NodeConfig {
  const rc = Object.create(null);

  for (const [key, value] of Object.entries(nodeConfig)) {
    Object.defineProperty(rc, key, {
      enumerable: true,
      writable: false,
      value: value,
    });
  }
  return rc as unknown as NodeConfig;
}
