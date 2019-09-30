// this bootstrap script is injected into the minimalist html page

import createPlugins from './utils/jss-plugins';
import SABootInfo from './bootstrap/components/SABootInfo';
import classNames from 'classnames';

import { createElement, createFactory } from 'react';

console.log(createElement);

console.log(classNames('hello'));

//classNames('foo', 'bar'); // => 'foo bar'

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
    console.log('started: jss');
    //const plugins = createPlugins().map(fn => fn({}));
    //const jss = create({ plugins });
    //
    // -> jss.use(camelCase());
    //
    /*const sheet = jss.createStyleSheet({
        containerLogo: {
            margin: 'auto'
        }
    },
        { media: 'screen' }
    )
    console.log(sheet);
    sheet.attach();
    */
    
    const mp = window.document.querySelector<HTMLElement>('#bootstrap');
    if (mp) {
        const infoCard = new SABootInfo({});
        infoCard.createFragment();
        infoCard.render();
        infoCard.mount(mp);
    }
    //const [manifest, error] = await fetchExt('./manifest.json');
    //console.log(manifest, error);
}

window.addEventListener('load', bootStrap);