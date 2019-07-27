// this bootstrap script is injected into the minimalist html page
export { };


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
    const [manifest, error] = await fetchExt('./manifest.json');
    console.log(manifest, error);
}

window.onload = bootStrap;




