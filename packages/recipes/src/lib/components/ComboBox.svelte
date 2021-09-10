<script lang="ts" context="module">
	export const prerender = false;
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	//svelte
	const dispatch = createEventDispatcher();

	//app
	import { connectorContext } from './connector';

	import Arrow, { ARROW_STATE } from './Arrow.svelte';
	import Input, { INPUT_STATE } from './Input.svelte';
	import Cross, { CROSS_STATE } from './Cross.svelte';
	import RubberBand, { RUBBER_BAND_STATE } from './RubberBand.svelte';

	import { Ingredient } from '$lib/dao/Ingredient';
	import { Recipe } from '$lib/dao/Recipe';


	const connector = connectorContext();

	/* 
	   States this edit line can be in 
       Recipe: 
        1. At the top ready to accept a new recipe name (click on green "+" will add new recipe)
        2. in the process of adding a new recipe name (">" token disabled) 
        3. adding a new ingredient (">" token does not exist)
        4. display existing recipe name
        5. displaying existing ingredient name
        6. filler only exist for new ingredient or recipe addition
    */

	export let id: string;
	export let value: string;
	export let seq: number;

	const [recipeId, ingredientId] = id.split(':').map((v) => parseInt(v, 10));
	console.log(`recipeId=${recipeId}, ingredientId=${ingredientId}`);
	const isRecipe = ingredientId === -1;

	const recipe = recipeId > 0 ? connector.findIdxOfRecipe(recipeId)[0] : new Recipe();
	const ingredient = ingredientId > 0 ? recipe.getIngredient(ingredientId) : ingredientId === 0 ? new Ingredient( 0, '') : undefined;

	// infer Arrow State
	function setArrowState(_recipe: Recipe, _ingredient?: Ingredient){
		if (!isRecipe){
			return ARROW_STATE.NONE;
		}
		if (_recipe.id === 0 && _recipe.ctx.focus === false){
			return ARROW_STATE.NONE;
		}
		let tState = ARROW_STATE.SHOW;
		if (_recipe.ctx.expanded){
			tState |= ARROW_STATE.DOWN;
		}
		return tState;
	}

	// infer Cross State
	function setCrossState(_recipe: Recipe, _ingredient?: Ingredient){
		if (_ingredient === undefined){
			if (_recipe.id === 0){
				if (_recipe.ctx.focus === false){
					return CROSS_STATE.GREEN;
				}
				return CROSS_STATE.RED;
			}
			return CROSS_STATE.BLACK;
		}
		// ingredient
		let tempState = CROSS_STATE.SMALL;
		if (_ingredient.ctx.focus){
			tempState |= CROSS_STATE.RED;
		}
		else {
			tempState |= CROSS_STATE.BLACK;
		}
		return tempState;
	}

	// infer rubbber band state
	function setRubberState(_recipe: Recipe, _ingredient?: Ingredient): number {
		if (_ingredient === undefined && _recipe.id === 0){
			if (_recipe.ctx.focus === false){
				return RUBBER_BAND_STATE.EXTEND;
			}
		}
		return RUBBER_BAND_STATE.NONE;
	}

	// infer input state
	function setInputState(_recipe: Recipe, _ingredient?: Ingredient): number {
		if (_recipe.id === 0) {
			if (_recipe.ctx.focus) {
				return INPUT_STATE.ADD;
			}
			return INPUT_STATE.NONE;
		}
		if (_recipe.id > 0 ){
			if (_ingredient === undefined){
				if (_recipe.ctx.focus) {
					return INPUT_STATE.MODIFY;
				}
				return INPUT_STATE.SHOW;
			}
			if (_ingredient.id === 0){
				if (_ingredient.ctx.focus){
					return INPUT_STATE.ADD;
				}
				throw new Error(`Internal error: adding new ingredient (recipeId=${_recipe.id}) but it has no focus, should not exist`);
			}
			if (_ingredient.id > 0){
				if (_ingredient.ctx.focus){
					return INPUT_STATE.MODIFY;
				}
				return INPUT_STATE.SHOW;
			}
		}
		throw new Error(`Internal error: could not determine state for input recipid.id=${_recipe.id}, ingredient=${_ingredient?.id}`);
	}

	// set focus
	function setForceFocus(_recipe: Recipe, _ingredient?: Ingredient): boolean {
		if (_ingredient === undefined){
			return recipe.ctx.focus;
		}
		return _ingredient.ctx.focus;
	}

	$: arrowState = setArrowState(recipe, ingredient);
	$: crossState = setCrossState(recipe, ingredient);
	$: inputState = setInputState(recipe, ingredient);
	$: rubberState = setRubberState(recipe, ingredient);
	$: forceFocus = setForceFocus(recipe, ingredient);


	function handleSubmit(e: Event & { currentTarget: EventTarget & HTMLFormElement }) {
		console.log('data submitted');
	}

	function handleCrossClick(e: MouseEvent) {
		console.log('crossclick');
		if (isRecipe && recipe.id === 0){
			if (recipe.ctx.focus){
				recipe.ctx.focus = false;
			}
			else {
				recipe.ctx.focus = true;
			}
			return;
		}
		// all other functions delete the recipe
		if (connector.remove(recipe.id)){
			dispatch('message',{ id: recipe.id, a:'del', c:'recipe' });
		}
	}

	function handleArrowClick(e: MouseEvent) {
		console.log('arrowclick');
	}

	function onBlur(e: FocusEvent){
		if (ingredient === undefined){
			recipe.ctx.focus = false;
			return;
		}
		ingredient.ctx.focus = false;
	}

	function onFocus(e: FocusEvent){
		if (ingredient === undefined){
			recipe.ctx.focus = true;
			return;
		}
		ingredient.ctx.focus = true;
	}
	

	
</script>

<form class:plain={true} class:isRecipe={!isRecipe} on:submit|preventDefault={handleSubmit}>
	<Cross state={crossState} on:click={handleCrossClick} />
	<Input state={inputState} {isRecipe} {seq} {forceFocus} bind:value on:blur={onBlur} on:focus={onFocus}/>
	{#if (recipe.id === 0) }
		<RubberBand state={rubberState} />
	{/if}
	{#if (ingredient === undefined)}
		<Arrow bind:state={arrowState} on:click={handleArrowClick} />
	{/if}
	{arrowState}
	{forceFocus}
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

	.plain.isRecipe {
		margin-left: var(--line-height-new-entry);
		line-height: var(--line-height-new-entry-detail);
		height: var(--line-height-new-entry-detail);
	}
</style>
