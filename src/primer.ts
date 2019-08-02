// this bootstrap script is injected into the minimalist html page

import createPlugins from './jss-plugins';
import SALogo from './SALogo';
import { create } from 'jss';

const isHttpValidResponse = (response: Response) => {
    const { status, statusText } = response;
    if (status >= 200 && status <= 299) {
        return Promise.resolve(response);
    }
    return Promise.reject(new Error(`Invalid response: ${status}/${statusText}`));
}

const toJSON = (response: Response) => {
    return response.json();
}

const finalHandler = (response: Response) => [response, null];

const errorHandler = (error: Error) => [null, error];

function fetchExt(url: string) {
    // "hint" to cache
    const headers = new Headers({ 'Cache-Control': 'no-cache' });
    return fetch(url, { method: 'GET', headers, mode: 'cors' })
        .then(isHttpValidResponse)
        .then(toJSON)
        .then(finalHandler)
        .catch(errorHandler);
}

async function bootStrap() {
    console.log('started');
    // mount svg element on id
    const plugins = createPlugins().map(fn => fn({}));
    const jss = create({ plugins });
    // jss.use(camelCase());
    const sheet = jss.createStyleSheet({
        containerLogo: {
            margin: 'auto'
        }
    },
        { media: 'screen' }
    ).attach();
    console.log(sheet);
    const mp = window.document.querySelector<HTMLElement>('#app-spinner');
    if (mp) {
        const logo = new SALogo(30, 10, 5, 0.8, 0.5);
        logo.mount(mp);
    }
    const [manifest, error] = await fetchExt('./manifest.json');
    console.log(manifest, error);
}

window.onload = bootStrap;