<style>
	main {
		display: grid;
		grid-template-columns: auto 1fr auto 1fr;
		border: 4px solid green;
	}
	#item1 {
		 border: 4px solid orange;
	}
	#item2 {
		 border: 4px solid purple;
	}
	span {
		 border: 4px solid red;
	}
</style>


<main>

  <!-- grid item: block child -->
  <div id="item1">block</div>

  <!-- grid item: floated element; floating is ignored -->
  <div id="item2" style="float: left;">float</div>

  <!-- grid item: anonymous block box around inline content -->
  anonymous item 3

  <!-- grid item: inline child -->
  <span>
    item 4
    <!-- grid items do not split around blocks -->
    <q style="display: block" id=not-an-item>item 4</q>
    item 4
  </span>
</main>


