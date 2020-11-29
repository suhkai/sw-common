const { validate } = require('jest-validate');

const configByUser = {
    transform: "123",
};

const result = validate(configByUser, {
    comment: 'Documentation: http://custom-docs.com',
    exampleConfig: { transform: '<rootDir>/node_modules/babel-jest' },
});

console.log(result);