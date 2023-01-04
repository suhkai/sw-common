import { setConfig, debug } from './dist/esm/index.mjs';

const printer = debug('worker1234');

setConfig({ namespaces: null});
printer('you will not see this line');

setConfig({ namespaces: 'worker*' });
printer('you will see this line');

//await new Promise(resolve => setTimeout(resolve, 500));
