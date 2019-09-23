import { create } from 'jss';
import createPlugins from './jss-plugins';

const plugins = createPlugins().map(fn => fn());
const jss = create({ plugins });

export default jss;