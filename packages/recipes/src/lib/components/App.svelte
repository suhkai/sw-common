<script lang="ts" context="module">
    export const prerender = true;
</script>

<script lang="ts">

import { onMount } from "svelte";
import { LocalStorageDriver } from '../dao/LocalStorageDriver';
import type { Recipe } from '../dao/Recipe';

let recipes: Recipe[] = [];

onMount(async () => {
    const storageDriver = new LocalStorageDriver();
    recipes = storageDriver.loadAll();
});

</script>

{#each recipes as recipe}
    <p>{recipe.name}</p>
{:else}
   <p>Loading...</p>
{/each}

