'use strict';

const { inferPathType } = require('@mangos/filepath');

module.exports = function inferFileType(fullPath) {
    const step = inferPathType(fullPath);
    const { value } = step.next();
    if (value) {
        return Object.keys(value)[0];
    }
};

