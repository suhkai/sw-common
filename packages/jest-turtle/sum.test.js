test('mock', function(done) {
  const myMock = jest.fn();

  const a = new myMock();
  const b = {};
  const bound = myMock.bind(b);
  bound();

  console.log(myMock.mock.instances[1] === b);
  // > [ <a>, <b> ]
  done();
});

test('mock return values', function(done) {
  const mock = jest.fn();

  mock.mockReturnValue(10,11);
  console.log(mock(), mock())
  
  done();
});