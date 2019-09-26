import ThemeContext from './ThemeContext';
import { JSSObject, JSSObjectTransform } from './types';

function mergeOuterInner(outer: JSSObject, inner: JSSObject | JSSObjectTransform) {
    if (typeof inner === 'function') {
        return inner(outer);
    }
    return Object.assign(outer, inner);
}

export default function ThemeProvider(props: { children: any, theme: JSSObject | JSSObjectTransform }) {
    const { children, theme: inner } = props;
    if (!children) return null;
    return (<ThemeContext.Consumer>{
        outer => {
            const theme = mergeOuterInner(outer, inner);
            return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
        }
    }</ThemeContext.Consumer>);
};

