<script lang="ts" context="module">
    export const prerender = true;
</script>

<script lang="ts">
    import { onMount } from 'svelte';
    import type { Recipe } from '../dao/Recipe';
    import type { StorageConnector } from '../dao/StorageConnector';

    import ComboBox from './ComboBox.svelte';
    import { COMBO_STATE } from './enums';

    // props
    export let connector: StorageConnector<Recipe>;


    // locals
    //1. All displayed ready to add new
    //2. editing a recipe name
    //3. editing an ingredient
    let recipes: Recipe[];
    
    // this will change according to behavior
    let showNewEntry = true;

    onMount(()=>{
       console.log(`connector is defined: ${!!connector}`);
       recipes = connector.loadAll();
    });

</script>

{#if showNewEntry }
    <ComboBox state={COMBO_STATE.RCP_NEW}/>
{/if}


