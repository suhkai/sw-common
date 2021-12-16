<style>
	* { 
	box-sizing: border-box;
}
main {
	height: 400px;
	width: 500px;
	border: 4px solid orange;
  grid: "H  H" 
        "A  B" 
        "F  F" 30px /* last row has fixed size of  30ox */
  /     auto 1fr; /* first and second column */
	
}
	#title    { grid-area: "f"; background: rgba(192,0,0,0.2); border:4px dashed black; }
  #score    { grid-area: auto; background: rgba(0,192,0,0.2); }
  #stats    { grid-area: auto; background: rgba(0,0,192,0.2); }
  #board    { grid-area: H; background: rgba(192,192,0,0.2); }
</style>
<main>
	<div id="title">F</div>
  <div id="score">A</div>
  <div id="stats">B</div>
  <div id="board">H</div>
</main>