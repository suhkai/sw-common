<main>
    <header>header</header>
    <article>article</article>
    <nav>some navigation content</nav>
    <aside>aside</aside>
    <footer>footer</footer>
</main>

<style>
	* {
		box-sizing: border-box;
	}
	:global(html){
		 padding:0;
		 margin:0;
		 height: 100%;
		 width: 100%;
	}
	
	
	:global(body){
		 padding:0;
		 margin:0;
		 height: 100%;
		 width: 100;
	}
	
	
    main {
			  border: 4px solid green;
			  height: 100%;
        display: grid;
        grid:
            "h h h"
            "a b c"
            "f f f";
        grid-template-columns: auto 1fr 20%;
    }
		header {
			 grid-area: h;
			 border: 4px yellow solid;
	  }
    article {
        grid-area: b;
        min-width: 12em;
			  border: 4px cyan solid;
    }
	  nav {
        grid-area: a; /* auto min-width */
			  border: 4px pink solid;
    }
    aside {
        grid-area: c;
        min-width: 12em;
			  border: 4px solid purple
    }
	  footer {
			 grid-area: f;
			 border: 4px solid orange;
			 padding:0;
			 margin: 0;
			
	  }
	
	@media all and (max-width: 60em) {
  /* Too narrow to support three columns */
  main {  grid:
          "h h"
		      "a a"
          "b c"
          "f f";
		      grid-template-columns: 1fr auto;
		      grid-template-rows: auto auto 1fr auto;
		}
}
    
</style>