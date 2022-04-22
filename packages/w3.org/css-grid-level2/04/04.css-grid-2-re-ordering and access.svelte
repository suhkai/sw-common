<main>
	<header>header</header>
	<article>article</article>
	<nav>some navigation content</nav>
	<aside>aside</aside>
	<footer>footer</footer>
</main>

<style>
	:global(*) {
		box-sizing: border-box;
	}
	:global(html),
	:global(body) {
		padding: 0;
		margin: 0;
		height: 100%;
		width: 100%;
	}

	:global(html) {
		/*border: 4px solid red;*/
	}

	:global(body) {
		/*border: 4px solid green;*/
	}

	:global(main) {
		height: 100%;
		border: 4px solid pink;
		display: grid;
		grid:
			"h h h" 1fr
			"a b c" 2fr
			"f f f" 30%
			/ auto 1fr 20%;
	}
	:global(header) {
		grid-area: h;
		border: 4px yellow solid;
	}
	:global(article) {
		grid-area: b;
		min-width: 12em;
		border: 4px cyan solid;
	}
	:global(nav) {
		grid-area: a; /* auto min-width */
		border: 4px pink solid;
	}
	:global(aside) {
		grid-area: c;
		min-width: 12em;
		border: 4px solid purple;
	}
	:global(footer) {
		grid-area: f;
		border: 4px solid orange;
		padding: 0;
		margin: 0;
	}

	@media all and (max-width: 60em) {
		/* Too narrow to support three columns */
		main {
			grid:
				"h h" auto
				"a a" auto
				"b c" 1fr
				"f f" auto
				/ 1fr auto;
		}
	}
</style>
