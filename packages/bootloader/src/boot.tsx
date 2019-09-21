import Preact from 'preact';

console.log(Preact);

function bootStrap() {
    console.log('started: jss');
    const mp = window.document.querySelector<HTMLElement>('#bootstrap');
}

window.addEventListener('load', bootStrap);