# blueimp 

```bash
npm install blueimp-tmpl
```



# variables available within templates: (https://github.com/blueimp/JavaScript-Templates#local-helper-variables)

- "o",   
- "tmpl",  
- "_s",  
- "_e", 
- "print", 
- "include" (utility function for tmpl aka _s+=tmpl(...)) // this helper is only usefull on the client side, (or server side if you overload the "loader") it cant take literal html (makes no sense right?) 

introduce additional local helper vars, with `tmpl.helper` can be extended

`helper`: oldhelper => oldhelper + ' additions ';
`arg`: (string) template function argument

# template parsing (https://github.com/blueimp/JavaScript-Templates#template-parsing)

`regexp`: math strings `{% ... %}` original `/([\s'\\])(?!(?:[^[]|\[(?!%))*%\])|(?:\[%(=|#)([\s\S]+?)%\])|(\[%)|(%\])/g`
`func`: replacement function

# output encoding (https://github.com/blueimp/JavaScript-Templates#output-encoding)

if the 

`encode`: (function) encode special chars using the `encReg` regexp (not usefull I think).
`encReg`: (regexp)
`encMap`: (replacement map) what is this

# template function argument (https://github.com/blueimp/JavaScript-Templates#template-function-argument)

https://github.com/blueimp/JavaScript-Templates


`load`: create a custom "resolver" for `tmpl(id, ..)` or `include(id, ...)`

arg = 'p' (the object that willbe the template argument object)  (https://github.com/blueimp/JavaScript-templates#template-function-argument)
helper = function (old_temp_helper) => return whatever

https://github.com/blueimp/JavaScript-templates#template-parsing
func = oldfunc => (s,p1,p2,p3,p4,offset,str);
regexp = (regular expression) 

helper : string
load: function (1)
encReg= /regexp/ https://github.com/blueimp/JavaScript-Templates#output-encoding


function replacer(match, p1, p2, p3, offset, string) {
  // p1 is nondigits, p2 digits, and p3 non-alphanumerics
  return [p1, p2, p3].join(' - ');
}

function(s, p1, p2, p3, p4, p5, offset, str) {

number of parameters will depend on the subgroups, so cant use arrow functions

function (template: string, data: any) : string 

# ejs (embedded? javascript templating)

function (tempalte string, data, options): string

[link](https://ejs.co/#install)


# underscore

function (template: string, data: any) : string 

[link](https://underscorejs.org/)

# pug

for us only important thing is `compile` (not `compileFile`);
`compileFile` uses `fs.readFileSync` but, no validation of the pathname, (guess it will throw an error)


### summary

Options needs to be checked to allow/disallow certain propvalues,

Ejection is a string to the rollup-html-template generator.

template-engine:
template-engine-options: context sensative.













