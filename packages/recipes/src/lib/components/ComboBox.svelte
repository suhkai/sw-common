<script lang="ts" context="module">
	export const prerender = false;
</script>

<script lang="ts">
	import { COMBO_STATE, INPUT_STATE, CROSS_STATE, RUBBER_BAND_STATE, ARROW_STATE } from './enums';

	import Arrow from './Arrow.svelte';
	import Input from './Input.svelte';
	import Cross from './Cross.svelte';
	import RubberBand from './RubberBand.svelte';

	const decisionTable = {
		[COMBO_STATE.RCP_NEW]: {
			crossState: CROSS_STATE.GREEN,
			inputState: INPUT_STATE.NONE,
			arrowState: ARROW_STATE.NONE
		},
		[COMBO_STATE.RCP_ADDING]: {
			crossState: CROSS_STATE.RED,
			inputState: INPUT_STATE.ADD,
			arrowState: ARROW_STATE.SHOW
		},
		[COMBO_STATE.RCP_SHOW]: {
			crossState: CROSS_STATE.BLACK,
			inputState: INPUT_STATE.SHOW,
			arrowState: undefined
		},
		[COMBO_STATE.RCP_MODIFY]: {
			crossState: CROSS_STATE.BLACK,
			inputState: INPUT_STATE.MODIFY,
			arrowState: undefined
		},
		[COMBO_STATE.ING_ADDING]: {
			crossState: CROSS_STATE.SMALL_RED,
			inputState: INPUT_STATE.ADD,
			arrowState: ARROW_STATE.NONE
		},
		[COMBO_STATE.ING_MODIFY]: {
			crossState: CROSS_STATE.SMALL_BLACK,
			inputState: INPUT_STATE.MODIFY,
			arrowState: ARROW_STATE.NONE
		},
		[COMBO_STATE.ING_SHOW]: {
			crossState: CROSS_STATE.SMALL_BLACK,
			inputState: INPUT_STATE.SHOW,
			arrowState: ARROW_STATE.NONE
		},
		_default: {
			crossState: CROSS_STATE.UNDEF,
			inputState: INPUT_STATE.UNDEF,
			arrowState: undefined
		}
	};

	/* states this edit line can be in 
       Recipe: 
        1. At the top ready to accept a new recipe name (click on green "+" will add new recipe)
        2. in the process of adding a new recipe name (">" token disabled) 
        3. adding a new ingredient (">" token does not exist)
        4. display existing recipe name
        5. displaying existing ingredient name
        6. filler only exist for new ingredient or recipe addition
    */

	export let state: COMBO_STATE | undefined;
	export let value: string = '';
	export let recipe_id: number | undefined;
	export let ingr_id: number | undefined;

	// input
	let isRecipe: boolean;
	let inputState: INPUT_STATE;

	// cross
	let crossState: CROSS_STATE;

	//rubber-band
	let rubberState: RUBBER_BAND_STATE;

	//arrow
	let arrowState: ARROW_STATE;

	$: {
		// cross
		console.log(`/combobox/input text: ${value}`);
		const st = Object.assign({}, decisionTable['_default'], decisionTable[state]);
		crossState = st.crossState;
		// input
		inputState = st.inputState;
		isRecipe = state >= COMBO_STATE.RCP_START && state < COMBO_STATE.ING_START;
		// rubber
		rubberState = state === COMBO_STATE.RCP_NEW ? RUBBER_BAND_STATE.EXTEND : RUBBER_BAND_STATE.NONE;
		// arrow
		if (st.arrowState !== undefined ){
			arrowState = st.arrowState;		
		}
	}

	function handleSubmit(e: Event & { currentTarget: EventTarget & HTMLFormElement }) {
		console.log('data submitted');
	}

	function handleCrossClick(e: MouseEvent) {
		console.log('crossclick');
	}

	function handleArrowClick(e: MouseEvent) {
		console.log('arrow click');
	}
</script>

<form class:plain={true} on:submit|preventDefault={handleSubmit}>
	<Cross state={crossState} on:click={handleCrossClick} />
	<Input state={inputState} {isRecipe} bind:value={value} />
	{#if state === COMBO_STATE.RCP_NEW || state === COMBO_STATE.RCP_ADDING}
		<RubberBand state={rubberState} />
	{/if}
	{#if state < COMBO_STATE.ING_START}
		<Arrow bind:state={arrowState} />
	{/if}
</form>

<style>
	.plain {
		line-height: var(--line-height-new-entry);
		height: var(--line-height-new-entry);
		display: flex;
		flex-direction: row;
		justify-content: stretch;
		padding: 0px;
	}
</style>
