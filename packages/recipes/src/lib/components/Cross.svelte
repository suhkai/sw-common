<script lang="ts" context="module">
	export const prerender = true;
	export enum ROLE {
		SMALL_BLACK,
		SMALL_RED,
		GREEN_PLUS,
		RED_CROSS
	}
</script>

<script lang="ts">
	// cross can be "+" or "x" (45 degrees rotated)
	export let rotate = false;
	
	// Cross can be in the context
	// 1: x smaller black cross, to delete existing "recipe" OR "recipe ingredient"
	// 2: Smaller red x cross, will rollup the ingredients list
	// 3: Green "+" to add new recipe at the top
	// 4: Red 'x' cross to cancel addition of recipe

	export let role: ROLE;

	$:rotate = (role === ROLE.SMALL_BLACK || role === ROLE.SMALL_RED || role === ROLE.RED_CROSS);
	$:small = (role === ROLE.SMALL_BLACK || role === ROLE.SMALL_RED);

</script>


<div class:cross={true} class:rotate class:small on:click>
	<svg version="1.1" viewBox="0 0 42 42">
		<line class="lcl" x1="21" y1="0" x2="21" y2="42"></line>
		<line class="lcl" x1="42" y1="21" x2="0" y2="21"></line>
	</svg>
</div>

<style>
.cross>svg {
    transition: all 0.2s linear;
}

.cross {
    width: 44px;
    height: 44px;
    position: relative;
    flex-grow:0;
    flex-shrink: 0;
}

.cross>svg {
    position: absolute;
    left: 10%;
    top: 10%;
    width: 80%;
    height: 80%;
}

.cross>svg line.lcl {
    fill: none;
    stroke: #23A24D;
    stroke-width: 2px;
}

.cross.rotate > svg line.lcl {
    stroke: #C5411E;
}

.cross.rotate > svg {
  transform: rotate(90deg);
}

.cross.small > svg {
    left: 20%;
    top: 20%;
    width: 60%;
    height: 60%;
}

.cross.thick-black > svg line.lcl {
    fill: none;
    stroke: #000;
    stroke-width: 4px;
}

</style>