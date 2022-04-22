<style type="text/css">
    #grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
        height: 20%;
    }
    #A { 
        grid-column: 1 / span 2;
        grid-row: 2;
        align-self: end;
        background: rgba(192,192,0,0.5);
    }
    #B { 
        grid-column: 1; 
        grid-row: 1; 
        z-index: 10;
        background: rgba(192,0,192,0.5);
    }
    #C { 
        grid-column: 2;
        grid-row: 1;
        align-self: start;
        /*margin-left: 20px;*/
        background: rgba(0,192,192,0.5);
    }
    #D { 
        grid-column: 2;
        grid-row: 2;
        padding: 50px;
        justify-self: end;
        align-self: start;
        z-index:2
        background: rgba(0,192,0,0.5);
    }
    #E {
        grid-column: 1 / span 2;
        grid-row: 1 / span 2;
      z-index: 5;
        justify-self: center;
        align-self: center;
        padding: 50px;
        background: rgba(0,192,0,0.5);
    }
    </style>
    <div id="grid">
      <div id="A">A</div>
      <div id="B">B</div>
      <div id="C">C</div>
      <div id="D">D</div>
      <div id="E">E</div>
    </div>