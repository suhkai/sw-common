<script lang="ts" context="module">
	export const prerender = false;
</script>

<script lang="ts">
	//svelte
	import {
		createEventDispatcher,
		tick,
		//	beforeUpdate,
		//	afterUpdate,
	} from "svelte";
	//app
	import { connectorContext } from "./connector";

	import Arrow, { ARROW_STATE } from "./Arrow.svelte";
	import Input, { INPUT_STATE } from "./Input.svelte";
	import Cross, { CROSS_STATE } from "./Cross.svelte";
	import RubberBand, { RUBBER_BAND_STATE } from "./RubberBand.svelte";

	import type { Ingredient } from "$lib/dao/Ingredient";
	import type { Recipe } from "$lib/dao/Recipe";

	const dispatch = createEventDispatcher();

	const connector = connectorContext();

	let upd = 0;

	function isNewIngredient(id?: number): boolean {
		return id !== undefined && id >= 0 && id < 1;
	}

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
	export let focus: boolean;

	let loseFocusBecauseBlur = false;

	let [recipeId, ingredientId] = id.split(":").map((v) => parseFloat(v));
	//console.log(`recipeId=${recipeId}, ingredientId=${ingredientId}`);

	const isRecipe = ingredientId === -1;

	function Xrecipe() {
		return connector.findIdxOfRecipe(recipeId)[0];
	}

	function Xingredient(_recipe?: Recipe) {
		if (ingredientId === -1) {
			return undefined;
		}
		return _recipe
			? _recipe.getIngredient(ingredientId)
			: Xrecipe().getIngredient(ingredientId);
	}

	
	function setName(r:Recipe, i?: Ingredient){
		if (i!==undefined){
			if (trimmed === ''){
				input = i.name;
			}
			else {
				i.name = input;
			}
		}
		else {
			if (trimmed === ''){
				input = r.name;
			}
			else {
				r.name = input;
			}
		}
	}

	// infer Arrow State
	function setArrowState() {
		if (ingredientId >= 0) {
			return ARROW_STATE.NONE;
		}
		const _recipe = Xrecipe();

		if (_recipe.id === 0 && _recipe.ctx.focus === false) {
			return ARROW_STATE.NONE;
		}
		let tState = ARROW_STATE.SHOW;
		if (_recipe.ctx.expanded) {
			tState |= ARROW_STATE.DOWN;
		}
		return tState;
	}

	// infer Cross State
	function setCrossState() {
		const _recipe = Xrecipe();
		const _ingredient = Xingredient(_recipe);

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
		if (isNewIngredient(_ingredient.id)) {
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
	function setRubberState(): number {
		const _recipe = Xrecipe();
		const _ingredient = Xingredient(_recipe);

		if (_ingredient === undefined) {
			if (_recipe.id === 0) {
				if (_recipe.ctx.focus === false) {
					if (_recipe.ingredients.length === 0) {
						_recipe.name = '';
						return RUBBER_BAND_STATE.EXTEND;
					}
				}
			}
			//return RUBBER_BAND_STATE.NONE;
		} else {
			if (isNewIngredient(_ingredient.id)) {
				if (_ingredient.ctx.focus === false) {
					_ingredient.name = '';
					return RUBBER_BAND_STATE.EXTEND;
				}
				//return RUBBER_BAND_STATE.NONE;
			}
		}
		return RUBBER_BAND_STATE.NONE;
	}

	// infer input state
	function setInputState(): number {
		const _recipe = Xrecipe();
		const _ingredient = Xingredient(_recipe);

		if (_ingredient === undefined) {
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
			if (isNewIngredient(_ingredient.id)) {
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

	let arrowState: number;
	let crossState: number;
	let inputState: number;
	let rubberState: number;

	$: {
		arrowState = setArrowState();
		crossState = setCrossState();
		inputState = setInputState();
		rubberState = setRubberState();
		upd; // triggers re-evaluation of vars
	}

	async function handleSubmit(
		/*e?: Event & { currentTarget: EventTarget & HTMLFormElement }*/
	) {
		// if you committed on an empty newline close the recipe
		const _recipe = Xrecipe();
		const _ingredient = Xingredient(_recipe);

		setName(_recipe, _ingredient);

		/*console.log(
			`onsubmit start recipe=${_recipe.id} ingredient=${_ingredient?.id}`
		);*/
		if (_ingredient && _ingredient.id >= 1) {
			const idx = _recipe.getIngredientIdx(ingredientId);
			const target = _recipe.ingredients[idx + 1];
			
			_ingredient.ctx.focus = false;
			target.ctx.focus = true;
			upd++;
			dispatch("message", "handleSubmit ingredient > 1");
			return;
		}

		if (isNewIngredient(_ingredient?.id)) {
			if ((<Ingredient>_ingredient).name === "") {
				_recipe.removeIngredient(0);
				_recipe.ctx.expanded = false;
				_recipe.ctx.focus = true;
				dispatch("message", "roll-up-recipe-check");
			} else if (connector.commit(recipeId, ingredientId)) {
				connector.saveAll();
				recipeId = _recipe.id;
				ingredientId =
					_recipe.ingredients[_recipe.ingredients.length - 1].id;
				console.log("data comitted");
				_recipe.removeIngredient(0);
				const ingr = _recipe.addIngredient(
					"",
					Math.random()
				) as Ingredient;
				connector.formatRowNumbers();
				dispatch("message", "add new ingredient 01");
				await tick();
				ingr.ctx.focus = true;
				await tick();
				dispatch("message", "add new ingredient 02");
			}
			upd++;
			return;
		}
		/*console.log(
			`onsubmit/w2/start recipe=${_recipe.id} ingredient=${_ingredient?.id}`
		);*/

		if (_recipe.id === 0) {
			if (connector.commit(recipeId, ingredientId)) {
				connector.saveAll();
				recipeId = _recipe.id;
				console.log("data comitted");
				_recipe.ctx.expanded = true;
				_recipe.ctx.focus = false;
				_recipe.removeIngredient(0);
				const inId = Math.random();
				const ingr = _recipe.addIngredient("", inId) as Ingredient;
				connector.formatRowNumbers();
				dispatch("message", "add new ingredient 01");
				await tick();
				ingr.ctx.focus = true;
				await tick();
				dispatch("message", "add new ingredient 02");
				await tick();
			}
		} else {
			connector.saveAll();
			_recipe.ctx.focus = false;
			if (_recipe.ctx.expanded) {
				_recipe.ingredients[_recipe.ingredients.length - 1].ctx.focus =
					true;
				dispatch("message", "move focus to new ingredient");
			} else {
				_recipe.ctx.expanded = true;
				_recipe.removeIngredient(0);
				const ingr = _recipe.addIngredient(
					"",
					Math.random()
				) as Ingredient;
				connector.formatRowNumbers();
				dispatch("message", "add new ingredient 01");
				await tick();
				ingr.ctx.focus = true;
				await tick();
				dispatch("message", "add new ingredient 02");
				await tick();
			}
		}
		upd++;
	}

	/*afterUpdate(() => {
		const _recipe = Xrecipe();
		const _ingredient = Xingredient(_recipe);
		console.log(
			`afterupdate recipe=${_recipe.id} ingredient=${_ingredient?.id}`
		);
	});*/

	/*beforeUpdate(() => {
		const _recipe = Xrecipe();
		const _ingredient = Xingredient(_recipe);
		console.log(
			`beforeupdate recipe=${_recipe.id} ingredient=${_ingredient?.id}`
		);
	});*/

	async function handleCrossClick(/*e?: MouseEvent*/) {
		const _recipe = Xrecipe();
		const _ingredient = Xingredient(_recipe);
		
		setName(_recipe, _ingredient);

		if (_ingredient !== undefined) {
			if (isNewIngredient(_ingredient.id)) {
				if (loseFocusBecauseBlur) {
					loseFocusBecauseBlur = false;
					return;
				}
				if (_ingredient.ctx.focus) {
					console.log("set focus ingredient to false");
					_ingredient.ctx.focus = false;
				} else {
					console.log("set focus ingredient to true");
					_ingredient.ctx.focus = true;
				}
				upd++;
			} else {
				_recipe.removeIngredient(_ingredient.id);
			}
		} else {
			if (_recipe.id === 0) {
				if (loseFocusBecauseBlur) {
					loseFocusBecauseBlur = false;
					return;
				}
				if (_recipe.ctx.focus) {
					_recipe.ctx.focus = false;
				} else {
					_recipe.ctx.focus = true;
				}
				await tick();
				//console.log(`/click/cross/recipe=0, focus=${_recipe.ctx.focus}`);
				upd++;
			} else {
				connector.remove(_recipe.id);
				connector.saveAll();
			}
		}
		dispatch(
			"message",
			`update cross click recipe=${_recipe.id} ingredient=${_ingredient?.id}`
		);
	}

	async function handleArrowClick(/*e?: MouseEvent*/) {
		const _recipe = Xrecipe();
		const _ingredient = Xingredient(_recipe);

		setName(_recipe, _ingredient);

		loseFocusBecauseBlur = false;

		if (_recipe.id === 0) {
			return;
		}
		if (_recipe.ctx.expanded) {
			if (_recipe.removeIngredient(0)) {
				connector.formatRowNumbers();
			}
			_recipe.ctx.expanded = false;
			_recipe.ctx.focus = true; // bring focus to this component
		} else {
			// add id=0 at the end if there is none
			_recipe.ctx.expanded = true;
			_recipe.removeIngredient(0);
			const ingr = _recipe.addIngredient("", Math.random()) as Ingredient;
			connector.formatRowNumbers();
			dispatch("message", "add new ingredient 01");
			await tick();
			ingr.ctx.focus = true;
			await tick();
			dispatch("message", "add new ingredient 02");
			await tick();
		}
		upd++;
		dispatch("message", "roll-up-recipe-check");
	}

	function onBlur(/*e?: FocusEvent*/) {
		let _recipe: Recipe;
		let _ingredient: Ingredient;

		

		try {
			_recipe = Xrecipe();
			_ingredient = Xingredient(_recipe) as Ingredient;
		} catch (err) {
			// was deleted do nothing
			console.error(
				`Internal warning: recipe=${recipeId}, ingredient=${ingredientId}`
			);
			return;
		}

		setName(_recipe, _ingredient);

		if (_ingredient === undefined) {
			if (_recipe.id === 0) {
				loseFocusBecauseBlur = true;
				setTimeout(() => {
					loseFocusBecauseBlur = false;
				}, 200);
			}
			_recipe.ctx.focus = false;
		} else {
			if (isNewIngredient(_ingredient?.id)) {
				loseFocusBecauseBlur = true;
				setTimeout(() => {
					loseFocusBecauseBlur = false;
				}, 200);
			}
			_ingredient.ctx.focus = false;
		}
		upd++;
		//console.log(`/onblur/recipe=${_recipe.id} ingredient=${_ingredient?.id}`);
		connector.saveAll(); // persist
		dispatch(
			"message",
			`unBlur recipe=${_recipe.id} ingredient=${_ingredient?.id}`
		);
	}

	function onFocus(/*e: FocusEvent*/) {
		const _recipe = Xrecipe();
		const _ingredient = Xingredient(_recipe);

		loseFocusBecauseBlur = false;
		if (_ingredient === undefined) {
			//console.log(`/onfocus/recipe=${_recipe.id} to true`);
			_recipe.ctx.focus = true;
		} else {
			_ingredient.ctx.focus = true;
			/*console.log(
				`/onfocus/false/recipe=${_recipe.id} ingredient=${_ingredient?.id}`
			);*/
		}
		upd++;
		dispatch(
			"message",
			`onFocus recipe=${_recipe.id} ingredient=${_ingredient?.id}`
		);
	}

	/*type BindName = {
		name: string;
	};

	let v: { name: string } = isRecipe ? Xrecipe() : Xingredient() as Ingredient;
	*/
	let input: string = (isRecipe ? Xrecipe() : Xingredient() as Ingredient).name;
	$: trimmed = input.trim();

	//1. I need to use a reference to the object because "bind:value={}" doesnt work with expressions.
</script>

<form
	class:plain={true}
	class:isRecipe={!isRecipe}
	on:submit|preventDefault={handleSubmit}
>
	<Cross state={crossState} on:click={handleCrossClick} />
	<Input
		state={inputState}
		{isRecipe}
		{seq}
		forceFocus={focus}
		bind:value={input}
		on:blur={onBlur}
		on:focus={onFocus}
	/>
	{#if isNewIngredient(Xingredient()?.id) || Xrecipe().id === 0}
		<RubberBand state={rubberState} />
	{/if}
	{#if Xingredient() === undefined}
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
