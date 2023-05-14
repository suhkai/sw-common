/* vender */
import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';

/* styles */
import styles from './App.module.scss';

/* components */

/* redux */

/* misc */

export default function App() {

    const className = useMemo(
        () =>
            classNames({
                [styles.app]: true,
            }),
        []
    );

    return (
        <div className={className}>
        </div>
    );
}
