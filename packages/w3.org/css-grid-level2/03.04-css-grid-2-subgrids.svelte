<!--

	    https://caniuse.com/?search=subgrid
	    SUBGRIDS ARE NOT SUPPORTED IN CHROME, ONLY IN FIREFOX
	
-->
<ul>
	<li><label for="name">Name:</label> <input id="name" name=fn></li>
	<li><label for="address">Address:</label> <input id="address" name=address></li>
	<li><label for="phone">Phone:</label> <input id="phone" name=phone></li>
</ul>

<style>
	input {
		 display: block;
		 height: 100%;
		 border: 4px blue solid;
		 margin:0;
		 padding:0;
	}
	* {
		box-sizing: border-box;
	}
	ul {
  	display: grid;
  	grid: 1fr 1fr 1fr / 1fr 1fr;
	}
	
	li {
  	grid-column: span 2;
  	display: grid;
  	grid-template-columns: subgrid;
  	border: solid 4px red;
	}
	label {
			border: 4px solid orange;
  		grid-column: 1;
	}
	input {
  	grid-column: 2;
	}
</style>