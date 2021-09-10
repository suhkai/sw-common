<script lang="ts" context="module">
    export const prerender = true;
</script>

<script lang="ts">

    import ComboBox from './ComboBox.svelte';
    import { connectorContext } from '$lib/components/connector';

    let showNewEntry = true;
    let recipes = connectorContext().loadAll();

    function handleMessageRecipe(e) {
        console.log(e);
        recipes = recipes;
    }

    function handleMessageIngredient(e) {
        console.log(e);
        recipes = recipes;
    }

    console.log(JSON.stringify(recipes));

</script>

{#if showNewEntry }
    <ComboBox id="0:-1" value={''} seq={1} />
{/if}
{#each recipes as recipe ( recipe.id+":-1") }
   <ComboBox value={recipe.name} id={recipe.id+":-1"} seq={recipe.rowNum} on:message={handleMessageRecipe}/>
   {#if (recipe.ctx.expanded)}
   {#each recipe.ingredients as ingredient (recipe.id+":"+ingredient.id) }
        <ComboBox value={ingredient.name} id={recipe.id+":"+ingredient.id} on:message={handleMessageIngredient} seq={ingredient.rowNum}/>
   {/each}
   {/if}
{/each}
