<script lang="ts" context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import ComboBox from './ComboBox.svelte';
	import { connectorContext } from '$lib/components/connector';
	import { Recipe } from '$lib/dao/Recipe';

	let showNewEntry = true;
    let connector = connectorContext();
	let recipes = connector.loadAll();

	function handleMessageRecipe(e) {
		recipes = recipes;
	}

	function handleMessageIngredient(e) {
		recipes = recipes;
	}

	if (showNewEntry) {
		recipes.unshift(new Recipe());
		connector.formatRowNumbers();
	}
</script>

{#each recipes as recipe (recipe.id + ':-1')}
	<ComboBox
		id={recipe.id + ':-1'}
		seq={recipe.rowNum}
		focus={recipe.ctx.focus}
		on:message={handleMessageRecipe}
	/>
	{#if recipe.ctx.expanded}
		{#each recipe.ingredients as ingredient (recipe.id + ':' + ingredient.id)}
			<ComboBox
				id={recipe.id + ':' + ingredient.id}
				on:message={handleMessageIngredient}
				seq={ingredient.rowNum}
				focus={ingredient.ctx.focus}
			/>
		{/each}
	{/if}
{/each}
