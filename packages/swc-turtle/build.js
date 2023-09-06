const swc = require("@swc/core");
//const path = require('node:path');
 
const code = `
import React from 'react';

export function SomeReact(){
    return <div>Hello world</div>;
}
`;

const { code: outputCode } = swc.transformSync(code, {
    // Some options cannot be specified in .swcrc
    filename: "stupid-file-name.jsx",
    sourceMaps: true,
    module: {
        type: 'commonjs',
    },
    jsc: {
        parser: {
            syntax: 'ecmascript',
            jsx: true
        },
        transform: {
            react: {
                runtime: 'automatic',
            },
        },
    }
  });

console.log(outputCode)
