/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import 'jest-localstorage-mock';

import { LocalStorageDriver } from '../LocalStorageDriver';
 
describe('LocalStorageDriver', () => {
     it('initalize', () => {
         //
         const lsd = new LocalStorageDriver();
         console.log(lsd.hasStorage());
         console.log(globalThis.localStorage);
     });
 })