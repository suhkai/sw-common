'use strict';

const mocha = require('mocha');
const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');
const mock = require('mock-fs');

const fs = require('fs');

const mkdirp = require('utils/mkdirp');
const getAllRequests = require('utils/getAllRequests');
const serializeRequest = require('utils/serialize/request');
const deserializeRequest = require('utils/deserialize/request');
const lexer = require('utils/deserialize/lexer');

chai.should();
chai.use(chaiAsPromised);
const { expect } = chai;

const fixtures = require('./fixtures');

describe('utils', () => {
    describe('mkdirp', () => {
        before(() => {
            mock({
                '/path/to/fake/dir': {
                    'some-file.txt': 'file content here',
                    'empty-dir': {/** empty directory */ },
                },
                'path/to/some.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
                'some/other/path': {/** another empty directory */ },
            });
        });
        it('path to existing regular file should be an error', async () => {
            const [, err] = await mkdirp('/path/to/fake/dir/some-file.txt', 'posix');// make it undependent of filesystem type
            expect(err).to.equal('/path/to/fake/dir/some-file.txt is not a directory');
        });
        it('path to existing dir should be ok', async () => {
            const [, err] = await mkdirp('/path/to/fake/dir', 'posix');// make it undependent of filesystem type
            expect(err).to.be.undefined;
        });
        it('create nonexistant paths', async () => {
            const [, err] = await mkdirp('some/other/path/dir1/dir2', 'posix');// make it undependent of filesystem type
            expect(err).to.be.undefined;
            const stat = fs.lstatSync('some/other/path/dir1/dir2');
            expect(stat.isDirectory()).to.be.true;
        });
        after(() => {
            mock.restore();
        });
    });
    describe('getAllRequests', () => {
        before(() => {
            mock({
                '/.cache': {
                    'favicon.request': '',
                    'favicon.png.fetching': new Buffer(23),
                    'assets': {/** empty directory */ },
                    'Open Sans': {
                        'all.css.request': ''
                    },
                    'somefile.request': {},
                },
                'path/to/some.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
                'some/other/path': {/** another empty directory */ },
            });
        });
        it('get all direntries ending in .request a to existing regular file should be an error', async () => {
            const results = await getAllRequests('/.cache');// make it undependent of filesystem type
            const { getAllRequests01 } = fixtures;
            const resultsForTest = results.map(([{ fullp, stat: { mode, size } }, error]) => [{ fullp, stat: { mode, size } }, error]);
            expect(resultsForTest).to.deep.equal(getAllRequests01);
        });
        it('get all direntries ending in .request a to existing regular file should be an error', async () => {
            const results = await getAllRequests('/.cache');// make it undependent of filesystem type
            const { getAllRequests01 } = fixtures;
            const resultsForTest = results.map(([{ fullp, stat: { mode, size } }, error]) => [{ fullp, stat: { mode, size } }, error]);
            expect(resultsForTest).to.deep.equal(getAllRequests01);
        });
        after(() => {
            mock.restore();
        });
    });
    describe('serialize', () => {
        it('request with no \\n or \\r in request headers', () => {
            const result = serializeRequest({
                url: 'https://fonts.googleapis.com/css?family=Roboto&display=swap',
                method: 'get',
                headers: {
                    Accept: '*/*'
                }
            });
            expect(result).to.equal('[request-url]\nurl=https://fonts.googleapis.com/css?family=Roboto&display=swap\n[request-method]\nmethod=get\n[request-headers]\nAccept=*/*');
        })
        it('request with \\n or \\r \\t in request headers', () => {
            const result = serializeRequest({
                url: 'https://fonts.googleapis.com/css?family=Roboto&display=swap',
                method: 'get',
                headers: {
                    Accept: '*/*',
                    ['X-sec-02']: '\t\nsomevalue\nsomeothervalue\r'
                }
            });
            expect(result).to.equal('[request-url]\nurl=https://fonts.googleapis.com/css?family=Roboto&display=swap\n[request-method]\nmethod=get\n[request-headers]\nAccept=*/*\nX-sec-02=\\t\\nsomevalue\\nsomeothervalue\\r');
        })
    });
    describe('deserialize', () => {
        describe('lexer', () => {
            it('lexer <- correct string with control chars', () => {
                const data =
                    "[request-url]\n\r\t" +
                    "url=https://fonts.googleapis.com/css?family=Roboto&display=swap\n" +
                    "[request-method]\n" +
                    "method=get\n\r" +
                    "[request-headers]\r\n" +
                    "Accept=*/*\n\r" +
                    "X-sec-02=\\t\\nsomevalue\\nsomeothervalue\\r";
                const [o, errors] = lexer(data);
                expect(errors).to.be.undefined;
                expect(o).to.deep.equal({
                    'request-url':
                        { url: 'https://fonts.googleapis.com/css?family=Roboto&display=swap' },
                    'request-method': { method: 'get' },
                    'request-headers':
                    {
                        Accept: '*/*',
                        'X-sec-02': '\\t\\nsomevalue\\nsomeothervalue\\r'
                    }
                })
            });
            it('lexer <- data with no section', () => {
                const data =
                    "url=https://fonts.googleapis.com/css?family=Roboto&display=swap\n" +
                    "[request-method]\n" +
                    "method=get\n\r";
                const [o, errors] = lexer(data);
                expect(o).to.deep.equal({ 'request-method': { method: 'get' } });
                expect(errors).to.equal('error on line 0, its not part of a section');
            });
            it('lexer <- no data (empty lines and comments)', () => {
                const data =
                    "#some comment" +
                    "  #some more comments\n" +
                    "\n\r";
                const [o, errors] = lexer(data);
                expect(o).to.deep.equal({});
                expect(errors).to.be.undefined;
            });
            it('lexer <- no data (empty lines and comments)', () => {
                const data =
                    "#some comment" +
                    "  #some more comments\n" +
                    "\n\r";
                const [o, errors] = lexer(data);
                expect(o).to.deep.equal({});
                expect(errors).to.be.undefined;
            });
        });
        describe('deserialization', () => {

        })
    });
});
