[css level 3](https://www.w3.org/TR/css-grid-2/#background)

```css
/*
  * Two columns:
   *  1. the first sized to content,
   *  2. the second receives the remaining space
   *     (but is never smaller than the minimum size of the board
   *     or the game controls, which occupy this column [Figure 4])
* */

 grid-template-columns:
    /* 1 */ auto
    /* 2 */ 1fr;
```

```css
/*
   * Three rows:
   *  3. the first sized to content,
   *  4. the middle row receives the remaining space
   *     (but is never smaller than the minimum height
   *      of the board or stats areas)
   *  5. the last sized to content.
   */

  grid-template-rows:
    /* 3 */ auto
    /* 4 */ 1fr
    /* 5 */ auto;
```

# Overview Grid (just skip for now)

examples (no formal spec, just show usage loosy foosy)

# 2.1 example

```css
  main {
     grid:  "H   H "
            "A   B "
            "F   F " 30px  
      /     auto 1fr;  
  }

```
# 2.2 Placing items

Placing with items with the following css directive:

- `grid-area`
- `grid-row`
- `grid-column`


# 2.3 Sizing the grid

"grid tracks" = 

# 7 Defining the grid

- `grid-template-columns`
- `grid-template-rows`

values: <track-list>|<auto-track-list>| subgrid <line-name-list>?


# 7.0.a `<track-list>`

- <track-list>        = [ <line-names>? [ <track-size> | <track-repeat> ] ]+ <line-names>?
- <line-names>        = '[' <custom-ident>* ']'  // because of '*' <custom-ident> can be empty?
- <track-size>        = <track-breadth> | minmax( <inflexible-breath>, <track-breath>) | fit-content (<length-percentage>)
- <line-names>        = '[' <custom-ident>* ']'  // because of '*' <custom-ident> can be empty?
- <track-repeat>      = repeat( [ <integer [1,∞]> ] , [ <line-names>? <track-size> ]+ <line-names>? )
- <track-breadth>     = <length-percentage> |<flex>|min-content | max-content | auto
- <inflexible-breath> = <length-percentage> |       min-content | max-content | auto
- <flex> =  fr unit
- <length-percentage> = <length>|<percentage>

# 7.0.b `<auto-track-list>`

**Notes:**
- the `width: fit-content();` (function) is not supported on most browsers
- the `width: fit-content;` value is supported in most browsers

