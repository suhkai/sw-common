// describe it expect
const chai = require('chai');
const { expect } = chai;
const createIterator = require('../lib/iterator');
const absorbComments = require('../lib/comments');
const absorbWhiteSpace = require('../lib/white-space');
const { isWS, isEscapeStart, isIdcp, isNumberStart } = require('../lib/checks-and-definitions')
const escape = require('../lib/escape');
const string = require('../lib/string');
const hash = require('../lib/hash');
const numeric = require('../lib/numeric');

function createPicker(iter) {
    const step = iter.peek();
    return function pick(n) {
        const rc = Array.from({ length: n });
        for (let i = 0; i < rc.length; i++) {
            iter.next();
            rc[i] = step.value;
        }
        return rc;
    }

}

describe('iterator', () => {
    describe('validate token stream', () => {
        it('test columns, row, follows css preprocessing rules', () => {
            const data = '\uFFFE\r\n\n\n/* a comment */\n\rzigbats\u000c';
            const result = Array.from(createIterator(data));
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
            const data = 'hi';
            const it = createIterator(data);
            const step = it.next();
            it.next();
            it.next();
            it.next();
            it.next();
            expect(step.done).to.equal(true);
        })
        it('reset beyond data bounds and within data bounds', () => {
            const data = 'hi';
            const it = createIterator(data);
            const step = it.next();
            expect(() => it.reset(100)).to.throw()
            it.reset(1, 2, 1)
            expect(step.value).to.deep.equal({ d: 'i', col: 2, row: 1, o: 1 });
        });
        it('reset within data bounds on a crlf boundery', () => {
            const data = 'hi\r\nthere';
            const it = createIterator(data);
            const step = it.next();
            while (!step.done) it.next();
            it.reset(3);
            expect({ d: step.value.d, o: step.value.o }).to.deep.equal({ d: '\n', o: 2 });
            it.next()
            expect({ d: step.value.d, o: step.value.o }).to.deep.equal({ d: 't', o: 4 });
        });
        it('reset within data bounds on a crlf boundery', () => {
            const data = 'hi\r\nthere';
            const it = createIterator(data);
            const step = it.next();
            while (!step.done) it.next();
            it.reset(0);
            expect(step.value).to.deep.equal({ d: 'h', col: 1, row: 1, o: 0 })
            it.next();
            it.reset();
            expect(step.value).to.deep.equal({ d: 'h', col: 1, row: 1, o: 0 })
        });
        it('reset within data bounds on a cr boundery', () => {
            const data = 'hi\rthere';
            const it = createIterator(data);
            const step = it.next();
            while (!step.done) it.next();
            it.reset(2);
            expect(step.value).to.deep.equal({ d: '\n', col: 6, row: 2, o: 2 })
        });
        it('reset within data bounds on a ff boundery', () => {
            const data = 'hi\u000cthere';
            const it = createIterator(data);
            const step = it.next();
            while (!step.done) it.next();
            it.reset(2);

            expect(step.value).to.deep.equal({ d: '\n', col: 6, row: 2, o: 2 })
        });
    });
    describe('comments', () => {
        it('absorbComment', () => {
            const data = 'some text\n\r\n/* some comment */';
            const iter = createIterator(data);
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
            const data = '/* \n\nsome comment ';
            const iter = createIterator(data);
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
            const data = '/* \n\nsome comment *';
            const iter = createIterator(data);
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
            const data = '/*';
            const iter = createIterator(data);
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
            const data = 's \n\u000C\r\n  ';
            const iter = createIterator(data);
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
            const data = ' some text\n\r\n/* some comment */';
            const iter = createIterator(data);
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
    describe('escape', () => {
        describe('isEscapeStart', () => {
            it('isEscapeStart \\"\\r\\n" should not signal false', () => {
                const data = '\\\r\n';
                const iter = createIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const _2 = step.value
                expect(isEscapeStart(_1.d, _2.d)).to.be.false;
            })
            it('isEscapeStart \\"\\r" should not signal false', () => {
                const data = '\\\r';
                const iter = createIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const _2 = step.value
                expect(isEscapeStart(_1, _2)).to.be.false;
            })
            it('isEscapeStart \\a should not signal false', () => {
                const data = '\\a';
                const iter = createIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const _2 = step.value
                expect(isEscapeStart(_1, _2)).to.be.true;
            })
            it('isEscapeStart \\ at EOF should signal true', () => {
                const data = '\\';
                const iter = createIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const _2 = step.value
                expect(isEscapeStart(_1, _2)).to.be.true;
            })
            it('isEscapeStart \\ at EOF should signal true', () => {
                const data = 'e';
                const iter = createIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const _2 = step.value
                expect(isEscapeStart(_1, _2)).to.be.false;
            });
        });
        describe('escape replacement', () => {
            it('escape \\123', () => {
                const data = '\\123';
                const iter = createIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const result = escape(_1, iter);
                expect(result).to.deep.equal({ s: 'ģ', loc: { col: 4, row: 1 }, o: 3 });
            });
            it('escape \\123', () => {
                const data = '\\123';
                const iter = createIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const result = escape(_1, iter);
                expect(result).to.deep.equal({ s: 'ģ', loc: { col: 4, row: 1 }, o: 3 });
            });
            it('escape \\123F', () => {
                const data = '\\123F';
                const iter = createIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const result = escape(_1, iter);
                expect(result).to.deep.equal({ s: 'ሿ', loc: { col: 5, row: 1 }, o: 4 });
            })
            it('escape \\123 F', () => {
                const data = '\\123 F';
                const iter = createIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const result = escape(_1, iter);
                expect(result).to.deep.equal({ s: 'ģ', loc: { col: 5, row: 1 }, o: 4 });
            })
            it('escape \\00123 A F', () => {
                const data = '\\00123 A F';
                const iter = createIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const result = escape(_1, iter);
                expect(Number(result.s.codePointAt(0)).toString(16)).to.equal('123');
            })
            it('escape \\FF0000 A F will become maxcode point fffd', () => {
                const data = '\\FF0000 A F';
                const iter = createIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const result = escape(_1, iter);
                expect(Number(result.s.codePointAt(0)).toString(16)).to.equal('fffd')
            })
            it('escape "\\EOF" a "\\" at EOF', () => {
                const data = '\\';
                const iter = createIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const result = escape(_1, iter);
                expect(result).to.deep.equal({ s: '�', loc: { col: 1, row: 1 }, o: 0 });
            })
            it('escape "\\x"', () => {
                const data = '\\x';
                const iter = createIterator(data);
                const step = iter.next();
                const _1 = step.value;
                iter.next()
                const result = escape(_1, iter);
                expect(result).to.deep.equal({ s: 'x', loc: { col: 2, row: 1 }, o: 1 });
            })
        })
    });
    describe('string', () => {
        it('vanilla string "\\123"', () => {
            const data = '"\\123"';
            const iter = createIterator(data);
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
            const data = '"hello w\\1F310 rld"';
            const iter = createIterator(data);
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
            const data = '"hello \n world"';
            const iter = createIterator(data);
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
            const data = '"hello world';
            const iter = createIterator(data);
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
            const data = '"hello\\\n world';
            const iter = createIterator(data);
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
            const data = '#--sometoken\\\n002d ame ';
            const iter = createIterator(data);
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
            const data = '#8_idName';
            const iter = createIterator(data);
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
            const data = '#8_idName';
            const iter = createIterator(data);
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
            const data = '#rt\\4456 s';
            const iter = createIterator(data);
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
            const data = '#rts ';
            const iter = createIterator(data);
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
            const data = '1E';
            const [_1, _2, _3] = Array.from(createIterator(data));
            expect(isNumberStart(_1, _2, _3)).to.be.true;
        });
        it('isNumberStart "-1E+9" should be true', () => {
            const data = '-1E+9';
            const [_1, _2, _3] = Array.from(createIterator(data));
            expect(isNumberStart(_1, _2, _3)).to.be.true;
        });
        it('isNumberStart "+" should be false', () => {
            const data = '+';
            const [_1, _2, _3] = Array.from(createIterator(data));
            expect(isNumberStart(_1, _2, _3)).to.be.false;
        });
        it('isNumberStart "+.2" should be true', () => {
            const data = '+.2';
            const [_1, _2, _3] = Array.from(createIterator(data));
            expect(isNumberStart(_1, _2, _3)).to.be.true;
        });
        it('isNumberStart "+.." should be false', () => {
            const data = '+..';
            const [_1, _2, _3] = Array.from(createIterator(data));
            expect(isNumberStart(_1, _2, _3)).to.be.false;
        });
        it('isNumberStart "+." should be false', () => {
            const data = '+.';
            const [_1, _2, _3] = Array.from(createIterator(data));
            expect(isNumberStart(_1, _2, _3)).to.be.false;
        });
        it('isNumberStart "+e" should be false', () => {
            const data = '+e';
            const [_1, _2, _3] = Array.from(createIterator(data));
            expect(isNumberStart(_1, _2, _3)).to.be.false;
        });
        it('isNumberStart ".1e" should be true', () => {
            const data = '.1e';
            const args = Array.from(createIterator(data));
            expect(isNumberStart(...args)).to.be.true;

        });
        it('isNumberStart ".e" should be false', () => {
            const data = '.e';
            const args = Array.from(createIterator(data));
            expect(isNumberStart(...args)).to.be.false;
        });
        it('isNumberStart "." should be false', () => {
            const data = '.';
            const args = Array.from(createIterator(data));
            expect(isNumberStart(...args)).to.be.false;
        });
    });
    describe('number', () => {
        function prepareTest(data) {
            const iter = createIterator(data);
            const pick = createPicker(iter);
            const [_1, _2, _3] = pick(3);
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
});
