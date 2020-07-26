'use strict'

// describe it expect
const chai = require('chai');
const { expect } = chai;

//
const StringIterator = require('../lib/lexer/cachedStringiterator');
const absorbComments = require('../lib/lexer/comments');
const absorbIdent = require('../lib/lexer/ident');
const absorbWhiteSpace = require('../lib/lexer/white-space');
const { isWS, isEscapeStart, isIdcp, isNumberStart, isIdStart } = require('../lib/lexer/checks-and-definitions')
const consumeEscape = require('../lib/lexer/escape');
const string = require('../lib/lexer/string');
const hash = require('../lib/lexer/hash');
const numeric = require('../lib/lexer/numeric');
const absorbATToken = require('../lib/lexer/attoken');


function pick(iter, n) {
    const step = iter.peek();
    const rc = Array.from({ length: n });
    for (let i = 0; i < rc.length; i++) {
        rc[i] = step.value;
        iter.next();
    }
    return rc;
}
describe('lexer', () => {
    describe('iterator', () => {
        describe('validate token stream', () => {
            it('test columns, row, follows css preprocessing rules', () => {
                const data = '\uFFFE\r\n\n\n/* a comment */\n\rzigbats\u000c'[Symbol.iterator]();
                const stri = new StringIterator(data)
                const result = Array.from(stri);
                expect(result).to.deep.equal([
                    { d: '\uFFFE', col: 1, row: 1, o: 0 },
                    { d: '\n', col: 2, row: 1, o: 1 },
                    { d: '\n', col: 1, row: 2, o: 3 },
                    { d: '\n', col: 1, row: 3, o: 4 },
                    { d: '/', col: 1, row: 4, o: 5 }, 
                    { d: '*', col: 2, row: 4, o: 6 }, 
                    { d: ' ', col: 3, row: 4, o: 7 },  
                    { d: 'a', col: 4, row: 4, o: 8 },
                    { d: ' ', col: 5, row: 4, o: 9 },
                    { d: 'c', col: 6, row: 4, o: 10 },
                    { d: 'o', col: 7, row: 4, o: 11 },
                    { d: 'm', col: 8, row: 4, o: 12 },
                    { d: 'm', col: 9, row: 4, o: 13 },
                    { d: 'e', col: 10, row: 4, o: 14 },
                    { d: 'n', col: 11, row: 4, o: 15 },
                    { d: 't', col: 12, row: 4, o: 16 },
                    { d: ' ', col: 13, row: 4, o: 17 },
                    { d: '*', col: 14, row: 4, o: 18 },
                    { d: '/', col: 15, row: 4, o: 19 },
                    { d: '\n', col: 16, row: 4, o: 20 },
                    { d: '\n', col: 1, row: 5, o: 21 },
                    { d: 'z', col: 1, row: 6, o: 22 },
                    { d: 'i', col: 2, row: 6, o: 23 },
                    { d: 'g', col: 3, row: 6, o: 24 },
                    { d: 'b', col: 4, row: 6, o: 25 },
                    { d: 'a', col: 5, row: 6, o: 26 },
                    { d: 't', col: 6, row: 6, o: 27 },
                    { d: 's', col: 7, row: 6, o: 28 },
                    { d: '\n', col: 8, row: 6, o: 29 }
                ]);
            });
            it('step beyond data bounds', () => {
                const data = 'hi'[Symbol.iterator]();;
                const it = new StringIterator(data)
                const step = it.next();
                it.next();
                it.next();
                it.next();
                it.next();
                expect(step.done).to.equal(true);
            })
            it('reset beyond data bounds and within data bounds', () => {
                const data = 'hi'[Symbol.iterator]();
                const it = new StringIterator(data)
                const step = it.next();
                it.reset(100);
                
                it.reset(1, 2, 1)
                expect(step.value).to.deep.equal({ d: 'i', col: 2, row: 1, o: 1 });
            });
            it('reset within data bounds on a crlf boundery', () => {
                const data = 'hi\r\nthere'[Symbol.iterator]();
                const it = new StringIterator(data)
                const step = it.next();
                while (!step.done) it.next();
                it.reset(3);
                expect({ d: step.value.d, o: step.value.o }).to.deep.equal({ d: '\n', o: 2 });
                it.next()
                expect({ d: step.value.d, o: step.value.o }).to.deep.equal({ d: 't', o: 4 });
            });
            it('reset within data bounds on a crlf boundery', () => {
                const data = 'hi\r\nthere'[Symbol.iterator]();;
                const it = new StringIterator(data);
                const step = it.next();
                while (!step.done) it.next();
                it.reset(0);
                expect(step.value).to.deep.equal({ d: 'h', col: 1, row: 1, o: 0 })
                it.next();
                it.reset();
                expect(step.value).to.deep.equal({ d: 'h', col: 1, row: 1, o: 0 })
            });
            it('reset within data bounds on a cr boundery', () => {
                const data = 'hi\rthere'[Symbol.iterator]();;
                const it = new StringIterator(data);
                const step = it.next();
                while (!step.done) it.next();
                it.reset(2);
                expect(step.value).to.deep.equal({ d: '\n', col: 6, row: 2, o: 2 })
            });
            it('reset within data bounds on a ff boundery', () => {
                const data = 'hi\u000cthere'[Symbol.iterator]();;
                const it = new StringIterator(data);
                const step = it.next();
                while (!step.done) it.next();
                it.reset(2);

                expect(step.value).to.deep.equal({ d: '\n', col: 6, row: 2, o: 2 })
            });
        });
    });
    describe('comments', () => {
        it('absorbComment', () => {
            const data = 'some text\n\r\n/* some comment */';
            const iter = new StringIterator(data[Symbol.iterator]());
            const step = iter.next();
            //ff
            while (step.value.d !== '/') {
                iter.next();
            }
            const _1 = step.value;
            iter.next();
            const _2 = step.value;
            const result = absorbComments(_1, _2, iter);
            iter.next();
            expect(step.done).to.be.true;
            const text = data.slice(result.s.o, result.e.o + 1);
            expect(text).to.equal('/* some comment */');
            expect(result).to.deep.equal({
                id: 2,
                s: { loc: { col: 1, row: 3 }, o: 12 },
                e: { loc: { col: 18, row: 3 }, o: 29 }
            });
        })
        it('absorb unclosed comment', () => {
            const data = '/* \n\nsome comment '[Symbol.iterator]();;
            const iter = new StringIterator(data);
            const step = iter.next();
            //ff
            while (step.value.d !== '/') {
                iter.next();
            }
            const _1 = step.value;
            iter.next();
            const _2 = step.value;
            const result = absorbComments(_1, _2, iter);
            expect(result).to.deep.equal({
                id: 2,
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 13, row: 3 }, o: 17 }
            });
            expect(step.done).to.be.true
        })
        it('absorb partly unclosed comment', () => {
            const data = '/* \n\nsome comment *'[Symbol.iterator]();;
            const iter = new StringIterator(data);
            const step = iter.next();
            //ff
            while (step.value.d !== '/') {
                iter.next();
            }
            const _1 = step.value;
            iter.next();
            const _2 = step.value;
            const result = absorbComments(_1, _2, iter);
            expect(result).to.deep.equal({
                id: 2,
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 14, row: 3 }, o: 18 }
            });
        })
        it('/* at end of string, no comment body', () => {
            const data = '/*'[Symbol.iterator]();
            const iter = new StringIterator(data);
            const step = iter.next();
            //ff
            while (step.value.d !== '/') {
                iter.next();
            }
            const _1 = step.value;
            iter.next();
            const _2 = step.value;
            const result = absorbComments(_1, _2, iter);
            expect(result).to.deep.equal({
                id: 2,
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 2, row: 1 }, o: 1 }
            })
        })
    });
    describe('whitespace', () => {
        it('absorb space at EOF', () => {
            const data = 's \n\u000C\r\n  '[Symbol.iterator]();;
            const iter = new StringIterator(data);
            const step = iter.next();
            while (!isWS(step.value.d)) {
                iter.next();
            }
            const ws1 = absorbWhiteSpace(iter);
            expect(ws1).to.deep.equal({
                id: 3,
                s: { loc: { col: 2, row: 1 }, o: 1 },
                e: { loc: { col: 2, row: 4 }, o: 7 }
            });
        });
        it('absorbLFCR tokens', () => {
            const data = ' some text\n\r\n/* some comment */'[Symbol.iterator]();;
            const iter = new StringIterator(data);
            const step = iter.next();
            while (!isWS(step.value.d)) {
                iter.next();
            }
            const ws1 = absorbWhiteSpace(iter);
            while (!isWS(step.value.d)) {
                iter.next();
            }
            const ws2 = absorbWhiteSpace(iter);
            while (!isWS(step.value.d)) {
                iter.next();
            }
            const ws3 = absorbWhiteSpace(iter);
            expect(ws1).to.deep.equal({
                id: 3,
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 1, row: 1 }, o: 0 }
            });
            expect(ws2).to.deep.equal({
                id: 3,
                s: { loc: { col: 6, row: 1 }, o: 5 },
                e: { loc: { col: 6, row: 1 }, o: 5 }
            });
            expect(ws3).to.deep.equal({
                id: 3,
                s: { loc: { col: 11, row: 1 }, o: 10 },
                e: { loc: { col: 1, row: 2 }, o: 11 }
            });
        })
    });
    describe('consumeEscape', () => {
        describe('isEscapeStart', () => {
            it('isEscapeStart \\"\\r\\n" should not signal false', () => {
                const data = '\\\r\n'[Symbol.iterator]();
                const iter = new StringIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const _2 = step.value
                expect(isEscapeStart(_1.d, _2.d)).to.be.false;
            })
            it('isEscapeStart \\"\\r" should not signal false', () => {
                const data = '\\\r'[Symbol.iterator]();
                const iter = new StringIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const _2 = step.value
                expect(isEscapeStart(_1, _2)).to.be.false;
            })
            it('isEscapeStart \\a should not signal false', () => {
                const data = '\\a'[Symbol.iterator]();
                const iter = new StringIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const _2 = step.value
                expect(isEscapeStart(_1, _2)).to.be.true;
            })
            it('isEscapeStart \\ at EOF should signal true', () => {
                const data = '\\'[Symbol.iterator]();
                const iter = new StringIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const _2 = step.value
                expect(isEscapeStart(_1, _2)).to.be.true;
            })
            it('isEscapeStart \\ at EOF should signal true', () => {
                const data = 'e'[Symbol.iterator]();
                const iter = new StringIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const _2 = step.value
                expect(isEscapeStart(_1, _2)).to.be.false;
            });
        });
        describe('escape replacement', () => {
            it('escape \\123', () => {
                const data = '\\123'[Symbol.iterator]();
                const iter = new StringIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const result = consumeEscape(_1, iter);
                expect(result).to.deep.equal({ s: 'ģ', loc: { col: 4, row: 1 }, o: 3 });
            });
            it('escape \\123', () => {
                const data = '\\123'[Symbol.iterator]();
                const iter = new StringIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const result = consumeEscape(_1, iter);
                expect(result).to.deep.equal({ s: 'ģ', loc: { col: 4, row: 1 }, o: 3 });
            });
            it('escape \\123F', () => {
                const data = '\\123F'[Symbol.iterator]();
                const iter = new StringIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const result = consumeEscape(_1, iter);
                expect(result).to.deep.equal({ s: 'ሿ', loc: { col: 5, row: 1 }, o: 4 });
            })
            it('escape \\123 F', () => {
                const data = '\\123 F'[Symbol.iterator]();
                const iter = new StringIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const result = consumeEscape(_1, iter);
                expect(result).to.deep.equal({ s: 'ģ', loc: { col: 5, row: 1 }, o: 4 });
            })
            it('escape \\00123 A F', () => {
                const data = '\\00123 A F'[Symbol.iterator]();
                const iter = new StringIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const result = consumeEscape(_1, iter);
                expect(Number(result.s.codePointAt(0)).toString(16)).to.equal('123');
            })
            it('escape \\FF0000 A F will become maxcode point fffd', () => {
                const data = '\\FF0000 A F'[Symbol.iterator]();
                const iter = new StringIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const result = consumeEscape(_1, iter);
                expect(Number(result.s.codePointAt(0)).toString(16)).to.equal('fffd')
            })
            it('escape "\\EOF" a "\\" at EOF', () => {
                const data = '\\'[Symbol.iterator]();
                const iter = new StringIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const result = consumeEscape(_1, iter);
                expect(result).to.deep.equal({ s: '�', loc: { col: 1, row: 1 }, o: 0 });
            })
            it('escape "\\x"', () => {
                const data = '\\x'[Symbol.iterator]();
                const iter = new StringIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const result = consumeEscape(_1, iter);
                expect(result).to.deep.equal({ s: 'x', loc: { col: 2, row: 1 }, o: 1 });
            })
        })
    });
    describe('string', () => {
        it('vanilla string "\\123"', () => {
            const data = '"\\123"'[Symbol.iterator]();
            const iter = new StringIterator(data);
            const step = iter.next();
            const result = string(iter);
            expect(step.done).to.be.true;
            expect(result).to.deep.equal({
                id: 5,
                value: '"ģ"',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 6, row: 1 }, o: 5 }
            });
        });
        // globe glyph
        it('above max coidpoint value "hello w\\1F310 rld"', () => {
            const data = '"hello w\\1F310 rld"'[Symbol.iterator]();
            const iter = new StringIterator(data);
            const step = iter.next();
            const result = string(iter);
            expect(step.done).to.be.true;
            expect(result).to.deep.equal({
                id: 5,
                value: '"hello w' + String.fromCodePoint(parseInt('0x1F310')) + 'rld"',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 19, row: 1 }, o: 18 }
            });
        });
        it('newline in string should return bad string', () => {
            const data = '"hello \n world"'[Symbol.iterator]();
            const iter = new StringIterator(data);
            const step = iter.next();
            const result = string(iter);
            expect(step.done).to.be.false;
            expect(result).to.deep.equal({
                id: 4,
                value: '"hello \n',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 8, row: 1 }, o: 7 }
            });
        });
        it('string does not terminate before EOF', () => {
            const data = '"hello world'[Symbol.iterator]();
            const iter = new StringIterator(data);
            const step = iter.next();
            const result = string(iter);
            expect(step.done).to.be.true;
            expect(result).to.deep.equal({
                id: 5,
                value: '"hello world',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 12, row: 1 }, o: 11 }
            });
        });
        it('string with invalid escape', () => {
            const data = '"hello\\\n world'[Symbol.iterator]();
            const iter = new StringIterator(data);
            const step = iter.next();
            const result = string(iter);
            expect(result).to.deep.equal(
                {
                    id: 4,
                    value: '"hello\\\n',
                    s: { loc: { col: 1, row: 1 }, o: 0 },
                    e: { loc: { col: 8, row: 1 }, o: 7 }
                });
            expect(step.done).to.be.false;
        });
    });
    describe('hash', () => {
        it('hash from malformed id token "#--sometoken\\\n002d ame "', () => {
            const data = '#--sometoken\\\n002d ame '[Symbol.iterator]();
            const iter = new StringIterator(data);
            const step = iter.next();
            const _1 = step.value;
            iter.next();
            const _2 = step.value;
            let ok = isIdcp(_2.d);
            expect(ok).to.be.true;
            const result = hash(_1, iter);
            expect(result).to.deep.equal({
                id: 6,
                flag: 'id',
                value: '--sometoken',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 12, row: 1 }, o: 11 }
            });
        });
        it('hash of unrestricted type  "#8_idName"', () => {
            // difference is the id starts with a number
            const data = '#8_idName'[Symbol.iterator]();
            const iter = new StringIterator(data);
            const step = iter.next();
            const _1 = step.value;
            iter.next();
            const _2 = step.value;
            let ok = isIdcp(_2.d);
            expect(ok).to.be.true;
            const result = hash(_1, iter);
            expect(result).to.deep.equal({
                id: 6,
                flag: 'unrestricted',
                value: '8_idName',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 9, row: 1 }, o: 8 }
            });
        });
        it('hash near the end of file "#rt', () => {
            // difference is the id starts with a number
            const data = '#8_idName'[Symbol.iterator]();
            const iter = new StringIterator(data);
            const step = iter.next();
            const _1 = step.value;
            iter.next();
            const _2 = step.value;
            let ok = isIdcp(_2.d);
            expect(ok).to.be.true;
            const result = hash(_1, iter);
            expect(result).to.deep.equal({
                id: 6,
                flag: 'unrestricted',
                value: '8_idName',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 9, row: 1 }, o: 8 }
            });
        });
        it('hash with valid escape "#rt\\456 s"', () => {
            // difference is the id starts with a number
            const data = '#rt\\4456 s'[Symbol.iterator]();
            const iter = new StringIterator(data);
            const step = iter.next();
            const _1 = step.value;
            iter.next();
            const _2 = step.value;
            let ok = isIdcp(_2.d);
            expect(ok).to.be.true;
            const result = hash(_1, iter);
            expect(result).to.deep.equal({
                id: 6,
                flag: 'id',
                value: 'rt䑖s',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 10, row: 1 }, o: 9 }
            });
        });
        it('hash with valid escape "#rts"', () => {
            // difference is the id starts with a number
            const data = '#rts '[Symbol.iterator]();
            const iter = new StringIterator(data);
            const step = iter.next();
            const _1 = step.value;
            iter.next();
            const _2 = step.value;
            let ok = isIdcp(_2.d);
            expect(ok).to.be.true;
            const result = hash(_1, iter);
            expect(result).to.deep.equal({
                id: 6,
                flag: 'id',
                value: 'rts',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 4, row: 1 }, o: 3 }
            });
        });
    });
    describe('isNumberStart', () => {
        it('isNumberStart "1E" should be true', () => {
            const data = '1E'[Symbol.iterator]();
            const [_1, _2, _3] = Array.from(new StringIterator(data));
            expect(isNumberStart(_1, _2, _3)).to.be.true;
        });
        it('isNumberStart "-1E+9" should be true', () => {
            const data = '-1E+9'[Symbol.iterator]();
            const [_1, _2, _3] = Array.from(new StringIterator(data));
            expect(isNumberStart(_1, _2, _3)).to.be.true;
        });
        it('isNumberStart "+" should be false', () => {
            const data = '+'[Symbol.iterator]();
            const [_1, _2, _3] = Array.from(new StringIterator(data));
            expect(isNumberStart(_1, _2, _3)).to.be.false;
        });
        it('isNumberStart "+.2" should be true', () => {
            const data = '+.2'[Symbol.iterator]();
            const [_1, _2, _3] = Array.from(new StringIterator(data));
            expect(isNumberStart(_1, _2, _3)).to.be.true;
        });
        it('isNumberStart "+.." should be false', () => {
            const data = '+..'[Symbol.iterator]()
            const [_1, _2, _3] = Array.from(new StringIterator(data));
            expect(isNumberStart(_1, _2, _3)).to.be.false;
        });
        it('isNumberStart "+." should be false', () => {
            const data = '+.'[Symbol.iterator]();
            const [_1, _2, _3] = Array.from(new StringIterator(data));
            expect(isNumberStart(_1, _2, _3)).to.be.false;
        });
        it('isNumberStart "+e" should be false', () => {
            const data = '+e'[Symbol.iterator]();
            const [_1, _2, _3] = Array.from(new StringIterator(data));
            expect(isNumberStart(_1, _2, _3)).to.be.false;
        });
        it('isNumberStart ".1e" should be true', () => {
            const data = '.1e'[Symbol.iterator]();
            const args = Array.from(new StringIterator(data));
            expect(isNumberStart(...args)).to.be.true;

        });
        it('isNumberStart ".e" should be false', () => {
            const data = '.e'[Symbol.iterator]();
            const args = Array.from(new StringIterator(data));
            expect(isNumberStart(...args)).to.be.false;
        });
        it('isNumberStart "." should be false', () => {
            const data = '.'[Symbol.iterator]();
            const args = Array.from(new StringIterator(data));
            expect(isNumberStart(...args)).to.be.false;
        });
    });
    describe('number', () => {
        function prepareTest(data) {
            const iter = new StringIterator(data[Symbol.iterator]());
            iter.next();
            const [_1, _2, _3] = pick(iter, 3);
            const r1 = isNumberStart(_1, _2, _3);
            if (r1) {
                const rc = function executeTest() {
                    iter.reset(_1.o, _1.col, _1.row);
                    return numeric(iter);
                }
                rc.iter = iter;
                return rc;
            }
        }
        it('number "1E4"', () => {
            {
                const executeTest = prepareTest("1E4");
                expect(executeTest).to.not.be.undefined;
                const result = executeTest();
                expect(result).to.deep.equal({
                    id: 7,
                    type: 'number',
                    d: '1E4',
                    s: { loc: { col: 1, row: 1 }, o: 0 },
                    e: { loc: { col: 3, row: 1 }, o: 2 }
                });
            }
            // lower case e
            {
                const executeTest = prepareTest("1e4");
                expect(executeTest).to.not.be.undefined;
                const result = executeTest();
                expect(result).to.deep.equal({
                    id: 7,
                    type: 'number',
                    d: '1e4',
                    s: { loc: { col: 1, row: 1 }, o: 0, },
                    e: { loc: { col: 3, row: 1 }, o: 2, }
                });
            }
        });
        it('number "1E+4"', () => {
            const executeTest = prepareTest("1E+4");
            expect(executeTest).to.not.be.undefined;
            const result = executeTest();
            expect(result).to.deep.equal({
                id: 7,
                type: 'number',
                d: '1E+4',
                s: { loc: { col: 1, row: 1 }, o: 0, },
                e: { loc: { col: 4, row: 1 }, o: 3, }
            });
        });
        it('number "+1123"', () => {
            const executeTest = prepareTest("+1123");
            expect(executeTest).to.not.be.undefined;
            const result = executeTest();
            expect(result).to.deep.equal({
                id: 7,
                type: 'integer',
                d: '+1123',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 5, row: 1 }, o: 4 }
            })
        });
        it('number "+11.23"', () => {
            const executeTest = prepareTest("+11.23");
            expect(executeTest).to.not.be.undefined;
            const result = executeTest();
            expect(result).to.deep.equal({
                id: 7,
                type: 'number',
                d: '+11.23',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 6, row: 1 }, o: 5, }
            });
        });
        it('number "+11."', () => {
            const executeTest = prepareTest("+11.");
            expect(executeTest).to.not.be.undefined;
            const result = executeTest();
            expect(result).to.deep.equal({
                id: 7,
                type: 'integer',
                d: '+11',
                s: { loc: { col: 1, row: 1 }, o: 0, },
                e: { loc: { col: 3, row: 1 }, o: 2, }
            })
        });
        it('number "+11.e-"', () => {
            const executeTest = prepareTest("+11.e-");
            expect(executeTest).to.not.be.undefined;
            const result = executeTest();
            const step = executeTest.iter.peek();
            expect(step.value.d).to.equal('.')
            expect(result).to.deep.equal({
                id: 7,
                type: 'integer',
                d: '+11',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 3, row: 1 }, o: 2 }
            });
        });
        it('number dimension "+11e-"', () => {
            const executeTest = prepareTest("+11e-");
            expect(executeTest).to.not.be.undefined;
            const result = executeTest();
            const step = executeTest.iter.peek();
            expect(step.done).to.be.true;
            expect(result).to.deep.equal({
                id: 9,
                type: 'integer',
                d: '+11',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 5, row: 1 }, o: 4 },
                dimension: 'e-',
                neo: 2,
                dso: 3
            });
        });
        it('number "11pt"', () => {
            const executeTest = prepareTest("11pt ");
            expect(executeTest).to.not.be.undefined;
            const result = executeTest();
            const step = executeTest.iter.peek();
            expect(step.done).to.be.false;
            expect(result).to.deep.equal({
                id: 9,
                type: 'integer',
                d: '11',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 4, row: 1 }, o: 3 },
                dimension: 'pt',
                neo: 1,
                dso: 2
            });
        });
        it('number "11.34%"', () => {
            const executeTest = prepareTest("11.34% ");
            expect(executeTest).to.not.be.undefined;
            const result = executeTest();
            const step = executeTest.iter.peek();
            expect(step.done).to.be.false;
            expect(result).to.deep.equal({
                id: 8,
                type: 'number',
                d: '11.34%',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 6, row: 1, o: 5 } }
            });
        });
    });
    describe('identlike', () => {
        it('bad url("something")', () => {
            const iter = new StringIterator('url("something")'[Symbol.iterator]());
            iter.next();
            const step = iter.peek();
            const result = absorbIdent(iter);
            expect(result).to.deep.equal({
                id: 13,
                d: 'url(',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { o: 3, loc: { col: 4, row: 1 } }
            });
        });
        it('bad url(    "something")', () => {
            const iter = new StringIterator('url(    "something")'[Symbol.iterator]());
            iter.next();
            const step = iter.peek();
            const result = absorbIdent(iter);
            expect(result).to.deep.equal({
                id: 16, //BAD_URL
                d: 'url(    "something")',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { o: 19, loc: { col: 20, row: 1 } }
            });
        });
        it('bad url(    "something"', () => {
            const iter = new StringIterator('url(    "something"'[Symbol.iterator]());
            iter.next();
            const step = iter.peek();
            const result = absorbIdent(iter);
            expect(result).to.deep.equal({
                id: 16, //BAD_URL
                d: 'url(    "something"',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { o: 18, loc: { col: 19, row: 1 } }
            });
        })
        it('bad url(    "\\001f47d lien"', () => {
            const iter = new StringIterator('url(    "\\001f47d lien"'[Symbol.iterator]());
            iter.next();
            const step = iter.peek();
            const result = absorbIdent(iter);
            expect(result).to.deep.equal({
                d: 'url(    "👽lien"',
                id: 16, // BAD_URL
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { o: 22, loc: { col: 23, row: 1 } }
            });
        })
        it('bad escape url(    "som\\\\n lien")  ', () => {
            const iter = new StringIterator('url(    "\\\nlien"'[Symbol.iterator]());
            iter.next();
            const step = iter.peek();
            const result = absorbIdent(iter);
            expect(result).to.deep.equal({
                id: 16,
                d: 'url(    "\\\nlien"',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { o: 15, loc: { col: 5, row: 2 } }
            });
        })
        it('good url(some-alien)', () => {
            const iter = new StringIterator('url(some-alien)'[Symbol.iterator]());
            iter.next();
            const step = iter.peek();
            const result = absorbIdent(iter);
            expect(result).to.deep.equal({
                id: 15, // URL
                d: 'url(some-alien)',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { o: 14, loc: { col: 15, row: 1 } }
            });
        })
        it('good url(some\\alien)', () => {
            const iter = new StringIterator('url(some\\alien)'[Symbol.iterator]());
            iter.next();
            const step = iter.peek();
            const result = absorbIdent(iter);
            expect(result).to.deep.equal({
                id: 15, // URL
                d: 'url(some\nlien)',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { o: 14, loc: { col: 15, row: 1 } }
            });
        })
        it('invalid escape bad url(some\\\n lien)', () => {
            const iter = new StringIterator('url(some\\\nlien)'[Symbol.iterator]());
            iter.next();
            const step = iter.peek();
            const result = absorbIdent(iter);
            expect(result).to.deep.equal({
                id: 16, // BAD URL
                d: 'url(some\\\nlien)',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { o: 14, loc: { col: 5, row: 2 } }
            });
        })
        it('white space only allowed before ")" or EOF, => bad url(some alien)', () => {
            const iter = new StringIterator('url(some alien)'[Symbol.iterator]());
            iter.next();
            const step = iter.peek();
            const result = absorbIdent(iter);
            expect(result).to.deep.equal({
                id: 16, // URL
                d: 'url(some alien)',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { o: 14, loc: { col: 15, row: 1 } }
            });
        })
        describe('white space only allowed before ")" or EOF', () => {
            it('url "url(some  "', () => {
                const iter = new StringIterator('url(some  '[Symbol.iterator]());
                iter.next();
                const step = iter.peek();
                const result = absorbIdent(iter);
                expect(result).to.deep.equal({
                    id: 15, // 
                    d: 'url(some  ',
                    s: { loc: { col: 1, row: 1 }, o: 0 },
                    e: { o: 9, loc: { col: 10, row: 1 } }
                });
            });
            it('url "url(some"', () => {
                const iter = new StringIterator('url(some'[Symbol.iterator]());
                iter.next();
                const step = iter.peek();
                const result = absorbIdent(iter);
                expect(result).to.deep.equal({
                    id: 15, // 
                    d: 'url(some',
                    s: { loc: { col: 1, row: 1 }, o: 0 },
                    e: { o: 7, loc: { col: 8, row: 1 } }
                });
            });
            it('url "url(some   )"', () => {
                const iter = new StringIterator('url(some   )'[Symbol.iterator]());
                iter.next();
                const step = iter.peek();
                const result = absorbIdent(iter);
                expect(result).to.deep.equal({
                    id: 15, // 
                    d: 'url(some   )',
                    s: { loc: { col: 1, row: 1 }, o: 0 },
                    e: { o: 11, loc: { col: 12, row: 1 } }
                });
            });
        });
        describe('function tokens', () => {
            it('"url(\'quoted value\')" is a function', () => {
                const iter = new StringIterator('url("quoted value")'[Symbol.iterator]());
                iter.next();
                const step = iter.peek();
                const result = absorbIdent(iter);
                expect(result).to.deep.equal({
                    id: 13, // FUNCTION
                    d: 'url(',
                    s: { loc: { col: 1, row: 1 }, o: 0 },
                    e: { o: 3, loc: { col: 4, row: 1 } }
                });
            });
            it('"calc( 100% -2*4px )', () => {
                const iter = new StringIterator('calc( 100% -2*4px )'[Symbol.iterator]());
                iter.next();
                const step = iter.peek();
                const result = absorbIdent(iter);
                expect(result).to.deep.equal({
                    id: 13, // FUNCTION
                    d: 'calc(',
                    s: { loc: { col: 1, row: 1 }, o: 0 },
                    e: { o: 4, loc: { col: 5, row: 1 } }
                });
            });
            it('"-moz-background" ident token', () => {
                const iter = new StringIterator('-moz-background'[Symbol.iterator]());
                iter.next();
                const step = iter.peek();
                const result = absorbIdent(iter);
                expect(result).to.deep.equal({
                    id: 14, // IDENT 
                    d: '-moz-background',
                    s: { loc: { col: 1, row: 1 }, o: 0 },
                    e: { loc: { col: 15, row: 1 }, o: 14 }
                });
            });
        });
    });
    describe('AT Token', () => {
        it('@font-face', () => {
            const iter = new StringIterator('@font-face'[Symbol.iterator]());
            iter.next();
            const step = iter.peek();
            const result = absorbATToken(iter);
            expect(result).to.deep.equal({
                id: 19,
                d: 'font-face',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 10, row: 1 }, o: 9 }
            });
        });

        it('@\\f123font-face', () => {
            const iter = new StringIterator('@\\123font-face'[Symbol.iterator]());
            iter.next();
            const [_1, _2, _3, _4] = pick(iter, 4);
            iter.reset(_1.o, _1.col, _1.row);
            expect(isIdStart(_2, _3, _4)).to.be.true;
            const step = iter.peek();
            const result = absorbATToken(iter);
            expect(result).to.deep.equal({
                id: 19,
                d: 'ሿont-face',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 14, row: 1 }, o: 13 }
            })

        });
        it('@-\\f123font-face', () => {
            const iter = new StringIterator('@-\\123font-face'[Symbol.iterator]());
            iter.next();
            const [_1, _2, _3, _4] = pick(iter, 4);
            iter.reset(_1.o, _1.col, _1.row);
            expect(isIdStart(_2, _3, _4)).to.be.true;
            const step = iter.peek();
            const result = absorbATToken(iter);
            expect(result).to.deep.equal({
                id: 19,
                d: '-ሿont-face',
                s: { loc: { col: 1, row: 1 }, o: 0 },
                e: { loc: { col: 15, row: 1 }, o: 14 }
            });
        });
    })
});
