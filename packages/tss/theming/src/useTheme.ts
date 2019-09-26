import { useContext }  from 'preact/hooks';
import ThemeContext from './ThemeContext';
export * from './types';

export default function useTheme(){
    const theme = useContext(ThemeContext);
    return theme;
}
