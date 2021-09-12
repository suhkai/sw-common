<script lang="ts" context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import ComboBox from './ComboBox.svelte';
	import { connectorContext } from '$lib/components/connector';
	import { Recipe } from '$lib/dao/Recipe';

    let connector = connectorContext();
	let recipes = connector.loadAll();
		recipes.unshift(new Recipe());
		connector.formatRowNumbers();
		connector.saveAll();
	
	
	let cnt = 0;
	function handleMessage(e) {
		console.log(`/message/${cnt++}`,e.detail);
		if (e.detail === "roll-up-recipe-check"){
			if (recipes.find(r => r.ctx.expanded === true) === undefined){
				if (recipes[0].id !== 0){
					recipes.unshift(new Recipe());
					connector.formatRowNumbers();
				}
			}
		}
		recipes = recipes;
	}
	
</script>

{#each recipes as recipe (recipe.id + ':-1')}
	<ComboBox
		id={recipe.id + ':-1'}
		seq={recipe.rowNum}
		focus={recipe.ctx.focus}
		on:message={handleMessage}
	/>
	{#if recipe.ctx.expanded}
		{#each recipe.ingredients as ingredient (recipe.id + ':' + ingredient.id)}
			<ComboBox
				id={recipe.id + ':' + ingredient.id}
				on:message={handleMessage}
				seq={ingredient.rowNum}
				focus={ingredient.ctx.focus}
			/>
		{/each}
	{/if}
{/each}
