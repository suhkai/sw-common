<script lang="ts" context="module">
	export const prerender = false;
</script>

<script lang="ts">
	import { INPUT_STATE } from './enums';
	/*
	    NONE=0,  // do not show input box
    	ADD,     // show input box green background
    	MODIFY   // show input box yellow background
		SHOW     // show input box transparent background
		UNDEF    // show input box orange background
	*/
	// style

	export let state: INPUT_STATE;
	export let isRecipe: boolean;
	export let value: string;

	const decisionTable = {
		[INPUT_STATE.NONE]: {
			adding: false,
			extend: false,
			modifying: false
		},
		[INPUT_STATE.ADD]: {
			adding: true,
			extend: true,
			modifying: false
		},
		[INPUT_STATE.MODIFY]: {
			adding: false,
			extend: true,
			modifying: true
		},
		[INPUT_STATE.SHOW]: {
			adding: false,
			extend: true,
			modifying: false
		},
		[INPUT_STATE.UNDEF]: {
			adding: true,
			extend: true,
			modifying: true
		},
		_default: {
			adding: false,
			extend: false,
			modifying: false
		}
	};

	let placeHolder: string;
	let extend: boolean;
	let adding: boolean;
	let modifying: boolean;

	$: {
		console.log(value);
		const st = Object.assign({}, decisionTable['_default'], decisionTable[state]);
		extend = st.extend;
		adding = st.adding;
		modifying = st.modifying;
		placeHolder = isRecipe ? 'Enter New Recipe Name' : 'Enter Ingredient or Empty[Enter] to save';
	}
</script>

<input
	type="text"
	class:base={true}
	class:isRecipe
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
		background-color: transparent;
	}

	.base:not(.extend) {
		width: 0px;
	}

	/* size of recipe */
	.base.isRecipe.extend {
		width: calc(100% - var(--line-height-new-entry) * 2);
		padding: 0 0.125em 0 0.125em;
	}

	.base.isRecipe {
		line-height: var(--line-height-new-entry);
		font-size: calc(var(--line-height-new-entry) * 0.7);
		height: var(--line-height-new-entry);
	}

	/* mutally exclusive, input is for recipe or ingredient */
	.base:not(.isRecipe) {
		line-height: var(--line-height-new-entry-detail);
		font-size: calc(--var(--line-height-new-entry-detail) * 0.7);
		height: var(--line-height-new-entry-detail);
	}

	.base:not(.isRecipe).extend {
		width: calc(100% - var(--line-height-new-entry-detail) - var(--line-height-new-entry) - 1px);
		padding: 0 0.125em 0 0.125em;
	}

	.adding:not(.modifying) {
		background-color: rgb(221, 255, 230); /*greenish*/
	}

	.modifying:not(.adding) {
		background-color: #ffffe0; /* yellowish*/
	}

	.adding.modifying {
		background-color: lightcoral;
	}
</style>
