import { createContext } from 'preact';
import { JSSObject } from './types';

const ThemeContext = createContext<JSSObject>(null);

export default ThemeContext;