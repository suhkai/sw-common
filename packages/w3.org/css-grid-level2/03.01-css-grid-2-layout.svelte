<div id="grid-implicit-rows">
	<div id="item1">item1</div>
	<div id="item2">item2</div>
	<div id="item3">item3</div>
	<!-- there will be an empty cell in the grid because of only 3 items -->
</div>

<div id="grid-using-grid-lines">
	<div id="item4">item4</div>
	<div id="item5">item5</div>
	<div id="item6">item6</div>
	<!-- there will be an empty cell in the grid because of only 3 items -->
</div>

<style>
	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: border-box;
	}

	/* EXAMPLE 6: https://www.w3.org/TR/css-grid-2/#grid-line-concept*/
	#grid-implicit-rows {
		display: grid;
		grid-template-columns: 150px 1fr;
		grid-template-rows: 50px 1fr 50px;
		border: 4px solid orange;
	}

	#item1 {
		grid-column: 2;
        grid-row-start: 1; 
		grid-row-end: 4;  /* implicit rows will be created here */
		background: rgba(255,0, 255, 0.5);
		border: 4px dashed black;
	}

	#item2 {
		background: lightcyan;
	}

	#item3 {
		background: lightyellow;
	}

	/* USING GRID LINES */

	#grid-using-grid-lines {
		display: grid;
		margin-top: 1rem;
		border: 4px pink solid;
		grid-template-columns: 150px [item1-start] 1fr [item1-end];
		grid-template-rows: [item1-start] 50px 1fr 50px [item1-end];
	}

	#item4 {
		background: lightgreen;
		grid-column: item1-start / item1-end;
		grid-row: item1-start / item1-end;
	}
	#item5 {
		background: lightgoldenrodyellow;
	}

	#item6 {
		background: lightsalmon;
	}
</style>
