<div id="grid">
    <div id="title">Game Title</div>
    <div id="score">Score</div>
    <div id="stats">Stats</div>
    <div id="board">Board</div>
    <div id="controls">Controls</div>
  </div>
  
  <style>
  @media (orientation: portrait) {
    #grid {
      display: grid;
  
      /* The rows, columns and areas of the grid are defined visually
       * using the grid-template-areas property.  Each string is a row,
       * and each word an area.  The number of words in a string
       * determines the number of columns. Note the number of words
       * in each string must be identical. */
      grid-template-areas: "title stats"
                           "score stats"
                           "board board"
                           "ctrls ctrls";
  
      /* The way to size columns and rows can be assigned with the
       * grid-template-columns and grid-template-rows properties. */
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto 1fr auto;
    }
  }
  
  @media (orientation: landscape) {
    #grid {
      display: grid;
  
      /* Again the template property defines areas of the same name,
       * but this time positioned differently to better suit a
       * landscape orientation. */
      grid-template-areas: "title board"
                           "stats board"
                           "score ctrls";
  
      grid-template-columns: auto 1fr;
      grid-template-rows: auto 1fr auto;
    }
  }
  
  /* The grid-area property places a grid item into a named
   * area of the grid. */
  #title    { grid-area: title; background: rgba(192,0,0,0.2); }
  #score    { grid-area: score; background: rgba(0,192,0,0.2); }
  #stats    { grid-area: stats; background: rgba(0,0,192,0.2); }
  #board    { grid-area: board; background: rgba(192,192,0,0.2); }
  #controls { grid-area: ctrls; background: rgba(192,0,192,0.2 ); }
  </style>
      