<style>
    #grid {
      display: grid;
      grid-template-columns: 40px;
      grid-auto-columns: max-content;
      grid-template-rows: 40px;
      grid-auto-rows: auto;
    }
    #A { grid-column: 1; grid-row: 1; border: 4px solid blue;}
    #B { grid-column: 2; grid-row: 1; border: 4px solid orange;}
    #C { grid-column: 1; grid-row: 2; border: 4px solid red;}
    #D { grid-column: 2; grid-row: 2; border: 4px solid cyan;}
  </style>
  
  <div id="grid">
    <div id="A">A</div>
    <div id="B">B</div>
    <div id="C">C</div>
    <div id="D">D</div>
  </div>