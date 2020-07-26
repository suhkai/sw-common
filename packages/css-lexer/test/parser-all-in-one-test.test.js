'use strict'
//node
const fs = require('fs');
const { resolve } = require('path')

// vendor
const chai = require('chai');
const { expect } = chai;

//api
const tokenizer = require('../lib/lexer')
const createStringIterator = require('../lib/lexer/iterator');
const createTokenWrapper = require('../lib/parser/iterator');

function createExtendedLexer(fileName) {
    const fixture = fs.readFileSync(resolve(__dirname, fileName), 'utf8');
    const iter = createStringIterator(fixture);
    const lexer = tokenizer(iter);
    const extendedLexer = createTokenWrapper(lexer);
    return { extendedLexer, lexer, iter, fixture }
}

describe('parser', () => {

    describe('extended lexer iterator', () => {
        it('initialize', () => {
            const { extendedLexer, lexer, iter, fixture } = createExtendedLexer('./fixtures/main.css');
            const stepE = extendedLexer.peek();
            const stepI = iter.peek();
            expect(stepE.done).to.be.false;
            expect(stepE.value).to.be.undefined;
            expect(stepI.done).to.be.false;
            expect(stepI.value).to.be.undefined;
            extendedLexer.next();
            expect(stepE.done).to.be.false
            expect(stepE.value).to.deep.equal({
                d: {
                    id: 14, // IDENT
                    d: 'body',
                    s: { loc: { col: 1, row: 1 }, o: 0 },
                    e: { loc: { col: 4, row: 1 }, o: 3 }
                },
                o: 0
            })
            expect(stepI.done).to.be.false;
            expect(stepI.value).to.deep.equal({ d: ',', col: 5, row: 1, o: 4 });
        });
        it('navigation via reset()', () => {
            const { extendedLexer, lexer, iter, fixture } = createExtendedLexer('./fixtures/main.css');
            const step = extendedLexer.peek();
            extendedLexer.reset(5); // always less tokens then individual octets, so "EOL" should be hit for sure
            expect(step.value).to.deep.equal({
                d: {
                    id: 14,
                    d: 'map-div',
                    s: { loc: { col: 12, row: 1 }, o: 11 },
                    e: { loc: { col: 18, row: 1 }, o: 17 }
                },
                o: 5 // 5th index
            });
            expect(step.done).to.be.false;
            extendedLexer.reset();
            expect(step.value).to.deep.equal({
                d: {
                    id: 14,
                    d: 'body',
                    s: { loc: { col: 1, row: 1 }, o: 0 },
                    e: { loc: { col: 4, row: 1 }, o: 3 }
                },
                o: 0
            });
            // slam it against the wall
            extendedLexer.reset(fixture.length);
            expect(step.done).to.be.true;
            expect(step.value).to.be.undefined;
            extendedLexer.reset(4);
            expect(step.value).to.deep.equal({
                d: {
                    id: 10,
                    d: '.',
                    s: { loc: { col: 11, row: 1 }, o: 10 },
                    e: { loc: { col: 11, row: 1 }, o: 10 }
                },
                o: 4
            });
        })
        it('navigation via Symbol.iterator and slice', () => {
            const { extendedLexer, lexer, iter, fixture } = createExtendedLexer('./fixtures/main.css');
            const step = extendedLexer.peek();
            let i = 0;
            for (const token of extendedLexer) {
                if (i++ > 5) break;
            }
            const answer = {
                d: {
                    id: 3,// whitespace
                    s: { loc: { col: 19, row: 1 }, o: 18 },
                    e: { loc: { col: 19, row: 1 }, o: 18 }
                },
                o: 6
            };
            expect(step.value).to.deep.equal(answer);
            const data = extendedLexer.slice(6, 7);
            expect(data).to.deep.equal([answer]);
        });
        it('iterator.next() after consuming all tokens',()=>{
            const { extendedLexer, lexer, iter, fixture } = createExtendedLexer('./fixtures/main.css');
            const step = extendedLexer.peek();
            for (const token of extendedLexer) { }
            extendedLexer.next();
            expect(step.value).to.be.undefined;
        })
    });
});