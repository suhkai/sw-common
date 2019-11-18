# template "engines"

- **done** underscore
- **done** pug
- **done** blueimp-template
- **done** handlebars (going to be a problem because ppl can register helpers, maybe only allow build in helpers)
- html-loader (aka no interpolation? verbatim as is?)


### underscore

not much to it, _.template  

- `<%= somevar %>`: aka `somevar` is an injected var ,`{somevar: 'hello world'}`.
- `<%- somevar %>`: same as above but `somevar` will be escaped.
- `<% print ('hello '+ somevar) %>`: aka `hello somevar` will be rendered
- `{{ name }}`: 

settings:
- interpolate
- escape
- evaluate


### handlebars

setting:
- `{{ ... }}`: this is how you should have
- `{{#list people}}{{firstName}} {{lastName}}{{/list}}`: block expressions

build in helpers

- if, else
- unless
- each
- with
- lookup
- log
- blockHelperMissing (for any helper not found)



