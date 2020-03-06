'use strict';

const mocha = require('mocha');
const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');
const mock = require('mock-fs');

const fs = require('fs');

const mkdirp = require('utils/mkdirp');
const getAllRequests = require('utils/getAllRequests');
const serializeRequest = require('utils/serialize/request');

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
            expect(result).to.equal('[request-url]\nhttps://fonts.googleapis.com/css?family=Roboto&display=swap\n[request-method]\nget\n[request-headers]\nAccept=*/*');
        })
        it('request with \\n or \\r in request headers', () => {
            const result = serializeRequest({
                url: 'https://fonts.googleapis.com/css?family=Roboto&display=swap',
                method: 'get',
                headers: {
                    Accept: '*/*',
                    ['X-sec-02']: '\t\nsomevalue\nsomeothervalue\r'
                }
            });
            expect(result).to.equal('[request-url]\nhttps://fonts.googleapis.com/css?family=Roboto&display=swap\n[request-method]\nget\n[request-headers]\nAccept=*/*\nX-sec-02=\\t\\nsomevalue\\nsomeothervalue\\r');
        })
    });
});
