
# 6 Grid Items

## 6.1 Grid item display

Grid items are _blockified_ first regardless if they are `<span></span>` or anonymous grid item (created around a string of text)
Anonymous box creation will not happen in a grid formatting context

## 6.2 Grid Item Sizing

self-alignment values (`align-self`, `justify-self` and `place-self` shorthand)

- `align-self`: align box along the _"cross-axis"_
- `justify-self`: align box along the _"main-axis"_ 

- `normal`:
    - if grid item is _replaced element_ with 
        - natural size
        - preferred aspect ratio + natural size in other dimension
    - then 
        - `align-self: start`
    - else if grid_item has preferred aspect ratio
        - size as _block level block_
    - else 
        - size as for `stretch`
- `stretch`:
    - Use "inline size":
        - Is "physical width" in horizontal wrting mode
        - Is "physical height" in vertical writing mode
-  **all other values**:
    - size item as "fit-content"
  
| Alignment         | Non-replaced Element Size        | Replaced Element Size |
| ----------------- | -------------------------------- | --------------------- |
| normal            | Fill grid area                   | Use natural size      |
| stretch           | Fill grid area                   | Fill grid area        |
| start/center/etc. | fit-content sizing (like floats) | Use natural size      |


## 6.3 order (re-order) grid property

Use the `order` property like in flexbox.

## 6.4 Margins and Paddings (grid items)

- margins do not collapse
- left/right/top/bottom margins and paddings **percentages** all resolve against their containing _block’s width_ in horizontal writing modes or _block's height_ in vertical writing mode.
- Auto margins expand to absorb space in the corresponding dimension, and therefor can be used for alignment

## 6.5 Z-axis Ordering: the `z-index` property

See svelte component `06.05-css-grid-2-z-axis-ordering.svelte`

## 6.6 Automatic Minimum Size of Grid Items


### Nomenclature

>**specified size suggestion**: If the item’s preferred size in the relevant axis is definite, then the specified size suggestion is that size. It is otherwise undefined.

>**transferred size suggestion**: If the item has a preferred aspect ratio and its preferred size in the opposite axis is definite, then the transferred size suggestion is that size (clamped by the opposite-axis minimum and maximum sizes if they are definite), converted through the aspect ratio. It is otherwise undefined.

>**content size suggestion**: The content size suggestion is the min-content size in the relevant axis, clamped, if it has a preferred aspect ratio, by any definite opposite-axis minimum and maximum sizes converted through the aspect ratio.

- if 
  - not scroll-container
  - spans at least one tract in axis whose minmax(auto,...)
  - spans more then one track, no track was sized with `[n]fr` (aka 1fr, 2fr).
- then
  - automatic minimum size (min-width/max-width) = (min-content/max-content)
- else
  - automatic minimum size (min-width/max-width) = (0,0)

- `content-based  minimum size` (of a grid item)
    - = `specified size suggestion` |
        - `transferred size suggestion` |
          - `content size suggestion` 
    
- if
  - spans only grid tracks with
  - max track sizing function minmax(..., length % or definite)
- then
  - `specified size suggestion`
  - `content size suggestion`
  - `transferred size suggestion`
  -  all above values are clamped to `stretch-fit` 
  -  (additionally) all size suggestion is clamped with `max-length`,`max-width` if definite
  
For a content based minimum size (`content based minimim size`) will cause the box size to be indefinite, even if the width was explicitly `definite`. precentages calculated against this size will behave like auto

Note: Sizing on content is difficult for the layout engine, it has to scan all grid-items and (within grid-item nested tags) to compute min/max content. This computation can be expensive on large grids. **Better the set the width of the box through the use of a indefinite aka `font-size: 12ex`

Better 














