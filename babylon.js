const babylon = require('@babel/parser');

const code = `function square(n) {
  return <div>n * n</div>;
}`;

const ast = babylon.parse(code, {
    sourceType: "module", // default: "script"
    plugins: ["jsx"] // default: []
});
console.log(ast.program.body[0].body.body[0]);
// Node {
//   type: "File",
//   start: 0,
//   end: 38,
//   loc: SourceLocation {...},
//   program: Node {...},
//   comments: [],
//   tokens: [...]
// }