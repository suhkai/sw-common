Use `npx serve` and then go to http://localhost:5000
### Notes:
 
- npx serve does badly resolving relative urls like `href="./something.css`, use `http-server` instead


# 3 Basic Font Properties

# 3.1 font-family
- generic ‘serif’, ‘sans-serif’, ‘cursive’, ‘fantasy’, and ‘monospace’.
- try between " tokens to catch spaces and other special chars.

# 3.2 font-weight
- normal (400) | bold (700) | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

| Inherited  value | bolder | lighter |
| ---------------- | ------ | ------- |
| 100              | 400    | 100     |
| 200              | 400    | 100     |
| 300              | 400    | 100     |
| 400              | 700    | 100     |
| 500              | 700    | 100     |
| 600              | 900    | 400     |
| 700              | 900    | 400     |
| 800              | 900    | 700     |
| 900              | 900    | 700     |


# 3.3 font-stretch
- hardly used in browsers

`font-stretch:expanded`  


# 3.4 font-style

- normal, italic, oblique

oblique is like italic, just less looked like written by hand

If no italic or oblique face is available, oblique faces can be synthesized by rendering non-obliqued faces with an artificial obliquing operation. (see `font-synthesis`)

# 3.5 font-size

- absolute size: xx-small | x-small | small | medium | large | x-large | xx-large
- relative-size: bigger|smaller
- length-percentage: use '%', 'em', 'pt', 'px', 'cm' etc

# 3.6  font-size-adjust

not used by today's browser
font-size-adjust: none|number (like 0.5)

adjust ratio between smallcaps and capitals

# 3.7 "font" property shorthand
- resets to default all props not specified explicitly in "font" shorthand

can also select system fonts (only if they are the first value spacified in "font" prop):

`font: caption|icon|menu|message-box|small-caption|status-bar`

```css
font: caption; /* select system font "caption" */
font: xyz caption; /* caption is second option , so its not the systemfont "caption" but a font named caption 
```

# 3.8 font-synthesis

not used by browsers?

```css
font-synthesis: none|weight|style| weight style
```

# 4 font resources

# 4.1 @font-face rule

@font-face {
    property: expr /* expressions */
}

# 4.2 "font-family" descriptor
'fontface' and 'src' must exist in the rule or ignore the fontface


# 4.3 src
 It is a css `url` token or `local` font-face-name

 there is optional format (hint) specifier 

```css
 src: url(...), format(...)
 .
 .
 src: url(ideal-sans-serif.woff2) format("woff2"),
       url(good-sans-serif.woff) format("woff"),
       url(basic-sans-serif.ttf) format("opentype");     

 src: local(Gentium Bold),
      local(Gentium-Bold), /*postscript*/
      url(GentiumBold.woff);
```

# 4.4 `font-style`, `font-weight`, `font-stretch`

```css
font-style: italic, oblique, normal; (initial value "normal")
font-weight: normal|bold|100|200| ... |900  (initial value: "normal")
font-stretch: normal | ultra-condensed | extra-condensed; (initial value "normal")
```

relative keywords `bolder` and `lighter` are not allowed

# 4.5 `unicode-range`

initial: `U+0-10FFFF`

```css
unicode-range: U+416 (single codepoint)
unicode-range: U+416-4fff (interval)
unicode-range: U+4?? (wildcard range, same as U+400-4ff)
```

# 4.6 using char-ranges to composite fonts

```css
unicode-range: U+A5, U+4E00-9FFF, U+30??, U+FF00-FF9F;
```

# 4.7 font-feature-settings

- does not affect font selection, defines initial settings when the font is rendered.
- explained more in chapter 7

# 4.8 font fetching

- cross origin, must set  `Access-Control-Allow-Origin` accordingly
  
# 5 Font matching algo

# 5.1 Case sensitivity  

Match fonts case **INSENSITIVE** name

# 5.2 Matching font styles

Note: `@font-face` rules with the same `family-name`, `font-style` etc and only different `unicode-range`) are grouped into a composite face.

4.a match on `font-stretch`
  - if font-stretch is a one of the `xxx-condensed` then it tries to match condensed ,if not possible it will try to match an `expanded` one.
  - if font-stretch is a one of the `xxx-expanded` then it tries to match expanded ,if not possible it will try to match an `condensed` one.

4.b match on `font-style`
  - `italic`: first check italic styles, then oblique, then normal
  - `normal`: first check normal, then oblique then italic
  - `oblique`: first check oblique, then italic, then normal

4.c match on `font-weight`
  - match exact the font-weight or match as close as possible using the following:
    - If the desired weight is less than 400, weights below the desired weight are checked in descending order followed by weights above the desired weight in ascending order until a match is found.
    - If the desired weight is greater than 500, weights above the desired weight are checked in ascending order followed by weights below the desired weight in descending order until a match is found.
    - If the desired weight is 400, 500 is checked first, then weights less then 400
    - If the desired weight is 500, 400 is checked first then weights less then 400 **(wait, is same as above)**

4.d match on `font-size`
  - scalable fonts: rounded to nearest whole pixel
  - bitmap fonts: mapped to margin of 20%

5.a if the font face is not loaded and character matches uni-code range, load font
5.b after downloading, if effective char map supports needed character, select font

**Note: 5b is post-load check, untill the actuall font is loaded, the @font-face rule could be a "lie"**

**Note: UA can use the `font-synthesis` to expand the matching possibilities, example: by creating artificial italic/oblique from normal face**

6. If matching font could not be selected, skip to the next family font fallback and repeat the matching sequence.
7. If no font could be found use system fallback font
8. if the character cannot be displayed using any font avail then display "missing glyph" (this is mostly an empty rectangle)

**Note: the "first available font" is a font that matches 0x20 (space) character**

# 5.3 Cluster Matching

matching ["combining characters"](https://en.wikipedia.org/wiki/Combining_character)
A sequence of codepoints containing combining mark or other modifiers is termed a _grapheme cluster_.
matching ["variation form of a glyph"](https://en.wikipedia.org/wiki/Variant_form_(Unicode)) using variation selectors

# 5.4. Character handling issues

# 6 Font feature

# 6.1 Glyph selection and positioning

# 6.2 Language specific display

Some examples of Spanish, Italian and French words are given where Glyphs are different depending on the words they are being used in.

Dutch "ij" > single 'ĳ'

# 6.3 `font-kerning` property

Kerning is the contextual adjustment of inter-glyph spacing.

`font-kerning: auto|normal|none`
   - auto: let user agent decide
   - normal: explicit enable
   - none: disable

# 6.4 `font-variant-ligatures`

values:
 - normal: common default features are enabled
 - none: disable explicitly
 - common-ligatures: Enables display of common ligatures
 - no-common-ligatures: Disables display of common ligatures
 - discretionary-ligatures: Enables display of discretionary ligatures ![image](./dlig.png)
 - no-discretionary-ligatures: explicit disable
 - `historical-ligatures`: ![image](./hlig.png)
 - `no-historical-ligatures`
 - `contextual`: ![image](./calt.png)
 - `no-contextual`

# 6.5  subscript and superscript (`font-variant-position`)

`font-variant-position`: normal|sub|super

# 6.6 Capitalization: `font-variant-caps`

`font-variant-caps`: normal | small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps

- `normal`: None of the features listed below are enabled.
- `small-caps`: Captials are still larger in size then lower-case, but the lower case has the glyps of uppercase
- `all-small-caps`: all glyps are upper case and have the same size
- `petite-caps`: looks like `small-caps`
- `all-petite-caps`: looks like `all-small-caps`
- `unicase`: lowercase have lowercase glyphs, uppercase have the same glyph, but both have the same size
    - 1.small capitals for uppercase
    - 2.normal lowercase letters
- `titling-caps`:
    - 1. Enables display of [titling capitals](https://en.wikipedia.org/wiki/Titling_capitals)


# 6.7 Numerical formatting: `font-variant-numeric`

value:
    - `normal`: no features enabled
    - `lining-nums`: enables display of lining numerals
    - `oldstyle-nums`: enables display of old-style numerals
    - `proportional-nums`: enbales display of tabular numerals
    - `diagonal-fractions`: display of lining diagonal fractions
    - `stacked-fractions`: ¹¹/₁₆ but horitontal line
    - `ordinal`: 1st 17th 2a ![image](./ordinals.png)
    - `slashed zero`: 4000 , the zero as you see them in the font

# 6.8 Asian text rendering
Not usefull for now

# 6.9 `font-variant` shorthand

Shorthand for combination of all
- `font-variant-ligatures`
- `font-variant-caps`
- `font-variant-numeric`
- `font-variant-east-asian`

# 6.10 Low level control `font-feature-settings`

value: <string> [ <integer> | on | off]?

Examples:
font-feature-settings: "dlig" 1;       /* dlig=1 enable discretionary ligatures */
font-feature-settings: "smcp" on;      /* smcp=1 enable small caps */
font-feature-settings: 'c2sc';         /* c2sc=1 enable caps to small caps */
font-feature-settings: "liga" off;     /* liga=0 no common ligatures */
font-feature-settings: "tnum", 'hist'; /* tnum=1, hist=1 enable tabular numbers and historical forms */
font-feature-settings: "tnum" "hist";  /* invalid, need a comma-delimited list */
font-feature-settings: "silly" off;    /* invalid, tag too long */
font-feature-settings: "PKRN";         /* PKRN=1 enable custom feature */
font-feature-settings: dlig;           /* invalid, tag must be a string */

# 7 font feature resolution

The way font features are applied

# 8 Object Model

```javascript
interface CSSFontFaceRule : CSSRule {
    readonly attribute CSSStyleDeclaration style;
};
```



























