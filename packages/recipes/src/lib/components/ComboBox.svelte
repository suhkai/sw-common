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
	export let seq: number;

	const [recipeId, ingredientId] = id.split(':').map((v) => parseInt(v, 10));
	console.log(`recipeId=${recipeId}, ingredientId=${ingredientId}`);
	const isRecipe = ingredientId === -1;

	const recipe = recipeId > 0 ? connector.findIdxOfRecipe(recipeId)[0] : new Recipe();
	const ingredient =
		ingredientId > 0
			? recipe.getIngredient(ingredientId)
			: ingredientId === 0
			? new Ingredient(0, '')
			: undefined;

	// infer Arrow State
	function setArrowState(_recipe: Recipe, _ingredient?: Ingredient) {
		if (_ingredient !== undefined) {
			return ARROW_STATE.NONE;
		}
		if (_recipe.id === 0 && _recipe.ctx.focus === false) {
			return ARROW_STATE.NONE;
		}
		let tState = ARROW_STATE.SHOW;
		if (_recipe.ctx.expanded) {
			tState |= ARROW_STATE.DOWN;
		}
		dispatch('message', { id: _recipe.id, s: tState });
		return tState;
	}

	// infer Cross State
	function setCrossState(_recipe: Recipe, _ingredient?: Ingredient) {
		if (_ingredient === undefined) {
			if (_recipe.id === 0) {
				if (_recipe.ctx.focus === false) {
					if (_recipe.ingredients.length === 0) {
						_recipe.name = '';
						return CROSS_STATE.GREEN;
					}
					//return CROSS_STATE.RED;
				}
				return CROSS_STATE.RED;
			}
			// recipe.id > 0
			if (_recipe.ctx.focus) {
				return CROSS_STATE.RED;
			}
			return CROSS_STATE.BLACK;
		}
		// this is an ingredient
		let tempState = CROSS_STATE.SMALL;
		if (_ingredient.id === 0) {
			if (_ingredient.ctx.focus) {
				tempState |= CROSS_STATE.RED;
			} else {
				tempState |= CROSS_STATE.GREEN;
			}
		} else {
			if (_ingredient.ctx.focus) {
				tempState |= CROSS_STATE.RED;
			} else {
				tempState |= CROSS_STATE.BLACK;
			}
		}
		return tempState;
	}

	// infer rubbber band state
	function setRubberState(_recipe: Recipe, _ingredient?: Ingredient): number {
		if (_ingredient === undefined) {
			if (_recipe.id === 0) {
				if (_recipe.ctx.focus === false) {
					if (recipe.ingredients.length === 0) {
						recipe.name = '';
						return RUBBER_BAND_STATE.EXTEND;
					}
				}
			}
			//return RUBBER_BAND_STATE.NONE;
		} else {
			if (_ingredient.id === 0) {
				if (_ingredient.ctx.focus === false) {
					ingredient.name = '';
					return RUBBER_BAND_STATE.EXTEND;
				}
				//return RUBBER_BAND_STATE.NONE;
			}
		}
		return RUBBER_BAND_STATE.NONE;
	}

	// infer input state
	function setInputState(_recipe: Recipe, _ingredient?: Ingredient): number {
		if (ingredient === undefined) {
			if (_recipe.id === 0) {
				if (_recipe.ctx.focus) {
					return INPUT_STATE.ADD;
				}
				if (_recipe.ingredients.length === 0) {
					return INPUT_STATE.NONE;
				}
				return INPUT_STATE.SHOW;
			} else {
				if (_recipe.ctx.focus) {
					return INPUT_STATE.MODIFY;
				} else {
					return INPUT_STATE.SHOW;
				}
			}
		} else {
			if (_ingredient.id === 0) {
				if (_ingredient.ctx.focus) {
					return INPUT_STATE.ADD;
				} else {
					return INPUT_STATE.NONE;
				}
			} else {
				if (_ingredient.ctx.focus) {
					return INPUT_STATE.MODIFY;
				} else {
					return INPUT_STATE.SHOW;
				}
			}
		}
	}

	// set focus
	function setForceFocus(_recipe: Recipe, _ingredient?: Ingredient): boolean {
		if (_ingredient === undefined) {
			return _recipe.ctx.focus;
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
		if (ingredient !== undefined) {
			if (ingredient.id === 0) {
				if (ingredient.ctx.focus) {
					console.log('set focus ingredient to false');
					ingredient.ctx.focus = false;
				} else {
					console.log('set focus ingredient to true');
					ingredient.ctx.focus = true;
				}
			} else {
				recipe.removeIngredient(ingredient.id);
			}
		} else {
			if (recipe.id === 0) {
				if (recipe.ctx.focus) {
					
					recipe.ctx.focus = false;
				} else {
					
					recipe.ctx.focus = true;
				}
			} else {
				connector.remove(recipe.id);
			}
		}
		dispatch('message', { id: recipe.id, a: 'del', c: 'recipe' });
	}

	function handleArrowClick(e: MouseEvent) {
		if (recipe.id === 0) {
			return;
		}
		if (recipe.ctx.expanded) {
			if (recipe.removeIngredient(0)) {
				connector.formatRowNumbers();
			}
			recipe.ctx.expanded = false;
			return;
		}
		// add id=0 at the end if there is none
		recipe.removeIngredient(0);
		recipe.addIngredient('', 0);
		connector.formatRowNumbers();
		recipe.ctx.expanded = true;
	}

	function onBlur(e: FocusEvent) {
		if (ingredient === undefined){
			if (recipe.id === 0){
				return;
			}
			recipe.ctx.focus = false;	
		}
		else {
		    if (ingredient.id === 0){
				return;
			}
			ingredient.ctx.focus = false;
		}
	}

	function onFocus(e: FocusEvent) {
		if (ingredient === undefined) {
			recipe.ctx.focus = true;
			return;
		}
		ingredient.ctx.focus = true;
	}

	type BindName = {
		name: string;
	};

	//1. I need to use a reference to the object because "bind:value={}" doesnt work with expressions.
	$: v = isRecipe ? recipe : ingredient;
</script>

<form class:plain={true} class:isRecipe={!isRecipe} on:submit|preventDefault={handleSubmit}>
	<Cross state={crossState} on:click={handleCrossClick} />
	<Input
		state={inputState}
		{isRecipe}
		{seq}
		{forceFocus}
		bind:value={v.name}
		on:blur={onBlur}
		on:focus={onFocus}
	/>
	{#if recipe.id === 0 || ingredient?.id === 0}
		<RubberBand state={rubberState} />
	{/if}
	{#if ingredient === undefined}
		<Arrow bind:state={arrowState} on:click={handleArrowClick} />
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

	.plain.isRecipe {
		margin-left: var(--line-height-new-entry);
		line-height: var(--line-height-new-entry-detail);
		height: var(--line-height-new-entry-detail);
	}
</style>
