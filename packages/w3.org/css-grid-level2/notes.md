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

"geid tracks" = 

Makes no sense at all better to jump to §7