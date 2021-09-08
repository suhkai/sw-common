<script lang="ts" context="module">
    export const prerender = true;
</script>

<script lang="ts">
    //svelte
    import { onMount} from 'svelte';
    
    //app
    import type { Recipe } from '../dao/Recipe';
    import ComboBox from './ComboBox.svelte';
    import { COMBO_STATE } from './enums';
    import { connector } from './connector';
       
    
    // locals
    //1. All displayed ready to add new
    //2. editing a recipe name
    //3. editing an ingredient
    let recipes: Recipe[];
    
    // this will change according to behavior
    let showNewEntry = true;

    onMount(()=>{
       recipes = connector().loadAll();
    });

</script>

{#if showNewEntry }
    <ComboBox state={COMBO_STATE.RCP_SHOW} value={'hello world!'} recipe_id={9} ingr_id={2}/>
{/if}


