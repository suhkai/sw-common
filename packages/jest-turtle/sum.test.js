const prettyFormat = require('pretty-format');

test('mock', function(done) {
  const myMock = jest.fn();

  const a = new myMock();
  const b = {};
  const bound = myMock.bind(b);
  bound();

  console.log(prettyFormat(a));
  // > [ <a>, <b> ]
  done();
});

test('mock return values', function(done) {
  const mock = jest.fn();

  mock.mockReturnValue(10,
    11);
  console.log(mock(), mock())
  
  done();
});