//import createPlugins from './jss-plugins';
import { create } from 'jss';

//const plugins = createPlugins().map(fn => fn());

const jss = create({ /*plugins*/ });

const sheet = jss.createStyleSheet({
    containerLogo: {
        margin: 'auto'
    }
},
    { media: 'screen' }
)
console.log(sheet);
sheet.attach();

