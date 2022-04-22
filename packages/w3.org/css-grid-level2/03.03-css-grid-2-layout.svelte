<div id="grid-areas">
	<div id="item1">item1</div>
	<div id="item2">item2</div>
	<div id="item3">item3</div>
	<!-- there will be an empty cell in the grid because of only 3 items -->
</div>

<style>
	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: border-box;
	}

	/* EXAMPLE 6: https://www.w3.org/TR/css-grid-2/#grid-line-concept*/
	#grid-areas {
		display: grid;
		grid-template-areas:
			". a"
			"b a"
			". a";
		grid-template-columns: 150px 1fr;
		grid-template-rows: 50px 1fr 50px;
	}

	#item1 {
		grid-area: a;
		background: rgba(255, 0, 255, 0.5);
		border: 4px dashed black;
	}

	#item2 {
		grid-area: b;
		background: lightcyan;
		align-self: start;
	}

	#item3 {
		grid-area: b;
		background: lightyellow;
	}

	/* 
		align-items/align-self: <block-axis>/<cross-axis> alignment
		justify-items/justify-self: <inline-axis>/<main-axis> alignment

		justify-content: <inline-axis>/<main-axis>
		align-content: <block-axis>/<cross-axis>
	*/

	#item2 { align-self: start; justify-self: start; border: 4px solid rgba(255,0,0,0.5); }
	#item3 { justify-self: end; align-self: end; border: 5px solid rgba(0,255,0,0); }

	
</style>
