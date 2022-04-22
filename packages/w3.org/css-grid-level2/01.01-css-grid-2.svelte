<div id="grid">
  <div id="title">Game Title</div>
  <div id="score">Score</div>
  <div id="stats">Stats</div>
  <div id="board">Board</div>
  <div id="controls">Controls</div>
  <div class:outliner={true} class:_1={true} />
  <div class:outliner={true} class:_2={true} />
  <div class:outliner={true} class:_3={true} />
  <div class:outliner={true} class:_4={true} />
  <div class:outliner={true} class:_5={true} />
  <div class:outliner={true} class:_6={true} />
</div>

<style>
  :global(*) {
    box-sizing: border-box;
  }
  :global(*::before) {
    box-sizing: border-box;
  }
  :global(*::after) {
    box-sizing: border-box;
  }
  :global(body) {
    background: white;
    font-size: 23px;
  }
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
    border: 4px solid red;
    height: 100%;
    grid-template-columns:
    /* 1 */
      auto
      /* 2 */ 1fr;
    grid-template-rows:
    /* 3 */
      auto
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
  #title {
    grid-column: 1;
    grid-row: 1;
    background: rgba(192, 0, 0, 0.2);
  }
  #score {
    grid-column: 1;
    grid-row: 3;
    background: rgba(0, 192, 0, 0.2);
  }
  #stats {
    grid-column: 1;
    grid-row: 2;
    justify-self: end;
    align-self: baseline;
    font-weight: bold;
    background: rgba(0, 0, 192, 0.2);
  }
  #board {
    grid-column: 2;
    grid-row: 1 / span 2;
    background: rgba(192, 192, 0, 0.2);
  }
  #controls {
    grid-column: 2;
    grid-row: 3;
    justify-self: center;
    background: rgba(192, 0, 192, 0.2);
    width: auto;
    z-index: 1;
    /*width: 100%;
  height: 100%;*/
  }

  /* these are to only show the grid cells, they do not impact sizing of the grid */
  :global(.outliner) {
    width: 100%;
    height: 100%;
    border: 4px solid rgba(0, 0, 228, 0.5);
  }

  :global(.outliner)._1 {
    grid-area: 3/2;
    z-index: -1;
  }

  :global(.outliner)._2 {
    grid-area: 3/1;
    z-index: 1;
    border: 4px solid rgba(0, 228, 228, 0.5);
  }

  :global(.outliner)._3 {
    grid-area: 2/1;
    z-index: 1;
    border: 4px solid rgba(288, 0, 228, 0.5);
  }

  :global(.outliner)._4 {
    grid-area: 2/2;
    z-index: 1;
    border: 4px solid rgba(288, 228, 0, 0.5);
  }

  :global(.outliner)._5 {
    grid-area: 1/1;
    z-index: 1;
    border: 4px solid rgba(0, 0, 288, 0.5);
  }

  :global(.outliner)._6 {
    grid-area: 1/2;
    z-index: 1;
    border: 4px solid rgba(288, 0, 288, 0.5);
  }
</style>
