// describe it expect
const chai = require('chai');
const { expect } = chai;
const createIterator = require('../lib/iterator');
const absorbComments = require('../lib/comments');
const absorbWhiteSpace = require('../lib/white-space');
const { isWS } = require('../lib/checks-and-definitions')

describe('createIterator', () => {
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
        ])
    });
    it('absorbCommenttest', () => {
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
    it('absorbWhiteSpace', () => {
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