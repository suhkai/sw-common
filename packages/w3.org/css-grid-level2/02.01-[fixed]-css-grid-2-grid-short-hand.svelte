<style>
	:global(*), :global(*::after), :global(*::before) {
    box-sizing: border-box;
	}
main {
  display: grid;
	height: 400px;
	width: 500px;
	border: 4px solid orange;
  grid: "H  H"
        "a  b"
        "F  F"  30px
        /auto 1fr; 
  
	
 }
  #title    { grid-area: F; background: rgba(0,192,0,0.2); }
  #score    { grid-area: auto; order: 3; background: rgba(0,192,0,0.2); }
  #stats    { grid-area: auto; order: 2; background: rgba(0,0,192,0.2); }
  #board    { grid-area: H; background: rgba(192,192,0,0.2); }
</style>
<main>
	<div id="title">title</div>
  <div id="score">score</div>
  <div id="stats">stats</div>
  <div id="board">board</div>
</main>
