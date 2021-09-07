<script lang="ts" context="module">
	export const prerender = false;
</script>

<script lang="ts">

    import { COMBO_STATE, INPUT_STATE, CROSS_STATE } from './enums';

	import Arrow from './Arrow.svelte';
	import Input from './Input.svelte';
	import Cross from './Cross.svelte';

	/* states this edit line can be in 
       Recipe: 
        1. At the top ready to accept a new recipe name (click on green "+" will add new recipe)
        2. in the process of adding a new recipe name (">" token disabled) 
        3. adding a new ingredient (">" token does not exist)
        4. display existing recipe name
        5. displaying existing ingredient name
        6. filler only exist for new ingredient or recipe addition
    */

	export let state: COMBO_STATE = COMBO_STATE.RCP_NEW;

	const plain = true;

	let plainFiller = true;
	let plainFillerExtend: boolean = true;

	// cross
	let crossRotate: boolean = false;
	let crossRole: CROSS_STATE = CROSS_STATE.GREEN_PLUS;

	// input
	let inputExtend: boolean = false;
	let recipe: boolean = true;
	let inputRole: INPUT_STATE = INPUT_STATE.NONE;
	let inputValue: string = '';

	//arrow
	let arrowRotate: boolean = false;
	let arrowShow: boolean = false;

    if (state === COMBO_STATE.ING_MODIFY){
        console.log('modifying');
    }


    function handleSubmit(e: Event & { currentTarget: EventTarget & HTMLFormElement }){


    }

    function handleCrossClick(e: MouseEvent){
        console.log('cross clicked');
    }

  

</script>

<form class:plain on:submit|preventDefault={handleSubmit}>
	<Cross rotate={crossRotate} role={crossRole} on:click={handleCrossClick} />
	<Input extend={inputExtend} {recipe} role={inputRole} value={inputValue} />
	{#if plainFiller}
		<div class:plain-filler={plainFiller} class:extend={plainFillerExtend} />
	{/if}
	<Arrow rotate={arrowRotate} show={arrowShow} />
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

	.plain-filler {
		height: var(--line-height-new-entry);
		flex-grow: 0;
	}

	.plain-filler:not(.extend) {
		width: 0;
	}

	.plain-filler.extend {
		width: 100%;
	}

	.plain-filler {
		transition: all 0.2s linear;
	}
</style>
