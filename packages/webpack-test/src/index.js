const _ = require('lodash');
const styles = require('./style.css');

console.log(`%c styles`, 'color:red', styles);

function component() {
    const element = document.createElement('div');
  
    
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');
    return element;
  }
  
  document.body.appendChild(component());