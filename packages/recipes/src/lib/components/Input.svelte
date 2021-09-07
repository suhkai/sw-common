<script lang="ts" context="module">
	export const prerender = false;
</script>

<script lang="ts">
	import { INPUT_STATE } from './enums';
	// style	
	export let extend: boolean = false;
	export let recipe: boolean = true;
	export let role: INPUT_STATE = INPUT_STATE.NONE; 
	export let value: string = '';
	
	const base = true;
	$:placeHolder = recipe ? 'Enter New Recipe Name' : 'Enter Ingredient or Empty[Enter] to save' 
	const adding = role === INPUT_STATE.ADD;
	const modifying = role === INPUT_STATE.MODIFY;
</script>

<input
	type="text"
	class:base
	class:recipe
	class:extend
	class:adding
	class:modifying
	placeholder={placeHolder}
	bind:value={value}
/>

<!--
	base: true
	extended: true/false
    recipe: true/false
	adding: true/false
	modify: true/false
-->

<style>
	.base {
		font-family: 'Open Sans';
		font-weight: 300;
		overflow: hidden;
		text-overflow: ellipsis;
		/*flex-shrink: 0;*/
		flex-grow: 0;
		padding: 0;
		transition: all 0.2s linear;
	}

	.base:not(.adding),
	.base:not(.modifying) {
		background-color: transparent;
	}

	.base:not(.extend) {
		width: 0px;
	}

	/* size of recipe */
	.base.recipe.extend {
		width: calc(100% - var(--line-height-new-entry) * 2);
		padding: 0 0.125em 0 0.125em;
	}

	.base.recipe {
		line-height: var(--line-height-new-entry);
		font-size: calc(var(--line-height-new-entry) * 0.7);
		height: var(--line-height-new-entry);
	}

	/* mutally exclusive, input is for recipe or ingredient */
	.base:not(.recipe) {
		line-height: var(--line-height-new-entry-detail);
		font-size: calc(--var(--line-height-new-entry-detail) * 0.7);
		height: var(--line-height-new-entry-detail);
	}

	.base:not(.recipe).extend {
		width: calc(100% - var(--line-height-new-entry-detail) - var(--line-height-new-entry) - 1px);
		padding: 0 0.125em 0 0.125em;
	}

	.adding {
		background-color: rgb(221, 255, 230); /*greenish*/
	}

	.modifying {
		background-color: #ffffe0; /* yellowish*/
    }

</style>
