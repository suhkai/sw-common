/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import 'jest-localstorage-mock';

import { LocalStorageDriver } from '../LocalStorageDriver';

const mock = jest.fn((a:number) => ''+a);
 
describe('LocalStorageDriver', () => {
     it('initalize', () => {
         //
         const lsd = new LocalStorageDriver();
         console.log(lsd.hasStorage());
         lsd.saveAll();
         console.log(globalThis.localStorage.length);
         console.log((globalThis.localStorage.setItem as jest.Mock<void,[a:string, b:string]>).mock.calls);
         (globalThis.localStorage.setItem as any).mockClear();
         console.log((globalThis.localStorage.setItem as any).mock.calls);
     });
 })