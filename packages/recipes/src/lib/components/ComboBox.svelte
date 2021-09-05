<script lang="ts" context="module">
	export const prerender = true;
    export enum STATE {
        RCP_NEW = 0,
        RCP_ADDING,
        RCP_SHOW,
        RCP_MODIFY,
        //
        ING_ADDING,
        ING_SHOW,
        ING_MODIFY
    }
</script>

<script lang="ts">
    import Arrow from './Arrow.svelte';
    
    import Input, { ROLE as INPUT_ROLE } from './Input.svelte';
    import Cross, { ROLE as CROSS_ROLE } from './Cross.svelte';

    /* states this edit line can be in 
       Recipe: 
        1. At the top ready to accept a new recipe name (click on green "+" will add new recipe)
        2. in the process of adding a new recipe name (">" token disabled) 
        3. adding a new ingredient (">" token does not exist)
        4. display existing recipe name
        5. displaying existing ingredient name

        6. filler only exist for new ingredient or recipe addition
    */
    const plain = true;
  

    
</script>

<form class:plain >
  
</form>

<style>
	.plain {
		line-height: var(--line-height-new-entry);
		height: var(--line-height-new-entry);
		display:flex;
        flex-direction: row;
        justify-content: stretch;
        padding: 0px;
	}

    .plainfiller {
        height:  var(--line-height-new-entry);
        flex-grow:0;
    }

    .plainfiller:not(.extend){
      width: 0;
    }

    .plainfiller.extend {
        width: 100%;
    }

    .plainfiller {
        transition: all 0.2s linear;
    }
   
</style>


