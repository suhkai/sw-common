/* vender */
import React, { useMemo } from 'react';
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
            Hello World!
        </div>
    );
}
