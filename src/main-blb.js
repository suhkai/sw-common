//https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
import "babel-polyfill";

function n(a, b = 1) {
    return a + b;
   }
console.log(n(1,2));

class Foo {
    method() {}
}