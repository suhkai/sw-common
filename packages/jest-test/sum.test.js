const sum = require('./sum');
const { getChangedFilesForRoots } = require('jest-changed-files');
const diff = require('jest-diff').default;
const prettyFormat = require('pretty-format');

const data = [];
const filterTestFn = jest.fn(a => data.push(a));

beforeEach(() => {
    //console.log('before each test');
    // this seems to work , return new Promise(resolve => setTimeout(resolve, 1000));
});

afterEach(() => {
    //console.log('after each test');
});

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

test('object assignment', () => {
    const data = { one: 1 };
    data['two'] = 2;
    expect(data).not.toEqual({ one: 0, two: 2 });
});

test('some async callback', done => {
    setTimeout(() => {
        done();
    }, 1);
});


test('some promise', () => {
    const promise = new Promise(resolve => {
        setTimeout(() => {
            resolve('hello worldly');
        }, 1);
    });
    expect(promise).resolves.toBe('hello worldly')
});

test('some promise reject', () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('r');
        }, 1);
    });
    return expect(promise).rejects.toMatch('r');
});

test('some promise reject async/await', async () => {
    let error;
    try {
        error = await new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('r'));
            }, 1);
        });
    }
    catch (err) {
        //console.log(err, typeof err)
        expect(err).toEqual(new Error('r'));
    }
});

test('testing mocked', () => {
    //const data = []
    const testFn = jest.fn(/*a => { data.push(a) }*/);
    filterTestFn.mockReturnValueOnce(true).mockReturnValueOnce(false);
    const result = [11, 12].filter(n => testFn(n));
    /* console.log("result", result);
     console.log("mock calls", testFn.mock.calls);
     console.log("mock calls results", testFn.mock.results);
     console.log("data", data);*/
});


test.skip('some test', () => {
    // print the set of modified files since last commit in the current repo
    return getChangedFilesForRoots(['../'], {
        lastCommit: true,
    }).then(result => console.log(result.changedFiles));
});


test('some test', () => {
    const a = { a: { b: { c: 5 } } };
    const b = { a: { b: { c: 6 } } };
    //console.log(typeof diff);
    const result = diff(a, b);
    console.log(result);
});

test('some test2', () => {
    const val = { object: {} };
    val.circularReference = val;
    val[Symbol('foo')] = 'foo';
    val.map = new Map([['prop', 'value']]);
    val.array = [-0, Infinity, NaN];
    console.log(prettyFormat(val));
});