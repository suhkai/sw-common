<style>
	
	
	* {
		box-sizing: border-box;
	}
	
	#grid {
  	display: grid;
  	grid-template-columns: 150px 1fr;
  	grid-template-rows: 50px 1fr 50px;
	}
	
	/*#item1 {
		grid-column: 2;
    grid-row-start: 1; grid-row-end: 4; 
	}
	
	#grid {
  	display: grid;
  	grid-template-columns: 150px [item1-start] 1fr [item1-end];
  	grid-template-rows: [item1-start] 50px 1fr 50px [item1-end];
	}*/
	
	#grid  {
		border:2px solid orange;
  	display: grid;
  	grid-template-areas: ". a"
    	                   "b a"
      	                 ". a";
  	grid-template-columns: 150px 1fr;
  	grid-template-rows: 50px 1fr 50px;
		overflow-x: auto;
}

#item1 { 
	border: 2px solid brown;
	background: rgba(192,0,0,0.2); 
	grid-area: a;
}
	
#item2 { 
	background: rgba(0, 192,0,0.2);
	grid-area: b;
	border: 2px solid blue;
}
	
#item3 { 
	border: 2px solid red;
	background: rgba(0,0,192,0.2);
	grid-area: b;
}

/* Align items 2 and 3 at different points in the grid area "b".  */
/* By default, grid items are stretched to fit their grid area    */
/* and these items would layer one over the other. */
#item2 { align-self: start; justify-self: start; }
#item3 { align-self: end; justify-self: end;  }
	
</style>

<div id="grid">
	<div id="item1">item1</div>
	<div id="item2">item2</div>	
	<div id="item3">item3</div>	
</div>