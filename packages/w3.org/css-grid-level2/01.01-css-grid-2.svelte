<style>
	#grid {
  /**
   * Two columns:
   *  1. the first sized to content,
   *  2. the second receives the remaining space
   *     (but is never smaller than the minimum size of the board
   *     or the game controls, which occupy this column [Figure 4])
   *
   * Three rows:
   *  3. the first sized to content,
   *  4. the middle row receives the remaining space
   *     (but is never smaller than the minimum height
   *      of the board or stats areas)
   *  5. the last sized to content.
   */
  display: grid;
  grid-template-columns:
    /* 1 */ auto
    /* 2 */ 1fr;
  grid-template-rows:
    /* 3 */ auto
    /* 4 */ 1fr
    /* 5 */ auto;
	/**
		understand:
		
		1. align-items/align-self (inline-axis alignment)
		2. justify-items/justify-self (block-axis alignment)
		
		// aligning the grid
		
		https://www.w3.org/TR/css-grid-2/#grid-align
		If the grid’s outer edges do not correspond to the grid container’s content edges 
		(for example, if no columns are flex-sized),
		the grid tracks are aligned within the content box according 
		to the justify-content and align-content properties on the grid container.
		
		3. justify-content
		4. align-content
		
		
		
		*/
	align-items: start;
	justify-items: end;
}
#title    { grid-column: 1; grid-row: 1; background: rgba(192,0,0,0.2) }
#score    { grid-column: 1; grid-row: 3; background: rgba(0,192,0,0.2)  }
#stats    { 
	grid-column: 1;
	grid-row: 2;
	justify-self: end;
	align-self: baseline;
	font-weight: bold;
	background: rgba(0,0,192,0.2);
}
#board    { grid-column: 2; grid-row: 1 / span 2; background: rgba(192,192,0,0.2) }
#controls { 
	grid-column: 2; 
	grid-row: 3; 
	justify-self: center; 
	background: rgba(192,0,192,0.2);
}
</style>

<div id="grid">
  <div id="title">Game Title</div>
  <div id="score">Score</div>
  <div id="stats">Stats</div>
  <div id="board">Board</div>
  <div id="controls">Controls</div>
</div>