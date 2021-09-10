<script lang="ts" context="module">
	export const prerender = false;
	export const CROSS_STATE = {
		SMALL: 1,
		BLACK: 2,
		GREEN: 4,
		RED: 8,
		UNDEF: 16
	};
	
</script>

<script lang="ts">
	export let state: number;

	$: black = (state & CROSS_STATE.BLACK) > 0;
	$: rotate = (state & (CROSS_STATE.BLACK | CROSS_STATE.RED)) > 0;
    $: small = (state & CROSS_STATE.SMALL) > 0;
	$: red = (state & CROSS_STATE.RED) > 0;
    $: green = (state & CROSS_STATE.GREEN) > 0;
		
</script>

<div class:cross={true} class:rotate class:small class:green class:red class:black on:click>
	<svg version="1.1" viewBox="0 0 42 42">
		<line class="lcl" x1="21" y1="0" x2="21" y2="42" />
		<line class="lcl" x1="42" y1="21" x2="0" y2="21" />
	</svg>
</div>

<style>
	.cross > svg {
		transition: all 0.2s linear;
	}

	.cross {
		width: 44px;
		height: 44px;
		position: relative;
		flex-grow: 0;
		flex-shrink: 0;
	}

	.cross.small {
		width: 30px;
		height: 30px;
	}

	.cross > svg {
		position: absolute;
		left: 10%;
		top: 10%;
		width: 80%;
		height: 80%;
	}

	.cross.green > svg line.lcl {
		fill: none;
		stroke: #23a24d;
		stroke-width: 2px;
	}

	.cross.red > svg line.lcl {
		fill: none;
		stroke: #c5411e;
		stroke-width: 2px;
	}

	.cross.black > svg line.lcl {
		fill: none;
		stroke: #000;
		stroke-width: 4px;
	}

	.cross.rotate > svg {
		transform: rotate(45deg);
	}

	.cross.black > svg {
		left: 20%;
		top: 20%;
		width: 60%;
		height: 60%;
	}

	.cross.black > svg line.lcl {
		fill: none;
		stroke: #000;
		stroke-width: 4px;
	}
</style>
