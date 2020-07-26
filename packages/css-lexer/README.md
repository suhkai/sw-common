
# Notes

## how to parse a css stylesheet
[seen](https://drafts.csswg.org/css-syntax-3/#css-stylesheets)


- Used a fonts.google.com css file (Open Sans) to test tokenization, looks good after fixing some minor bugs.
- move on to parsing section (formal) to make it safe

## parser

### consume @ (at) rule

@rule [{ simple block }] [consume component value]   ;

### consume simple block 

[..] or {..}  (...)

#eof (parse error return block)
... = input token, or component value 

### component value

- `simple block`: {... }, (...), [...]
- `consume function-token`
  - consume function
- `current input token`

### consume funtion
- consume function token
  - current intput token untill ')'
  - eof , parse error

### parse a declaration
- if next input tok is whitespace, consume it
- if next input tok is ident-token, return syntax error
- consume decleration

### consume a declaration
- trigger on ident-token
   - consume input token (the ident token) and give the decleration the name of the token
   - loop consume whitespace input tokens and sink it
   - next input token must be ":"
   - loop consume whitespace input tokens and sink it
   - anything else then EOF, consume `component value`
   - loop consume whitespace input tokens and sink it
   - consume "!" + "ident token with the value "important"
   - loop consume whitespace input tokens and sink it
   - loop consume whitespace tokens and sink it

### consume a list of declaration
- consume next token
   - whitespace/semicolon do nothing
   - eof return list of declerations
   - @ token, consume, "atrule"
   - ident-token: 
      - loop, aslong as next-it is not eof or ';' consume "component value"
      - when ';' is encounters process the above consumption as a decleration
   - anything else
      - this is a parse error, reconsume untill you see ";" or "eof"
    

### parse a stylesheet
  - consume "list of rules" with top level flag set
  - return stylesheet

### consume list of rules
  - repeatedly consume next-it
     - eof: return list of rules
     - cdo/cdc: if top level do nothing
     -   if not top level consume "qualified rule"
     - at-keyword token - consume at rule
     - anything else: consume "qualified rule"

### consume at-rule
 - already "@" was previously consumed
 - loop: consume next-it
    - ";" return at rule
    - eof: parse error return at rule
    - "{": consume smple block, assign to to at-rule-block, return at rule
    - anything else "component-value" append it to at-rule prelude


