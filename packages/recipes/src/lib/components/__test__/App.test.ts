/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'

import { render } from '@testing-library/svelte'

import App from '../App.svelte';

describe.skip('App component', () => {

    it('test1', () => {

        const { getByText } = render(App);
        expect(getByText('Spagetti')).toBeInTheDocument();
    });
})



