# blueimp 

```bash
npm install blueimp-tmpl
```

[github repo](https://github.com/blueimp/JavaScript-Templates)

options

temp_arg = 'p' (the object that willbe the template argument object) 
temp_helper = function (old_temp_helper) => return whatever
temp_func = oldfunc => (s,p1,p2,p3,p4,offset,str);


[str.replace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter)


function replacer(match, p1, p2, p3, offset, string) {
  // p1 is nondigits, p2 digits, and p3 non-alphanumerics
  return [p1, p2, p3].join(' - ');
}

function(s, p1, p2, p3, p4, p5, offset, str) {

number of parameters will depend on the subgroups, so cant use arrow functions

function (originalFunction){
    retrun function(){
        handle arguments here..
    }
}



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













