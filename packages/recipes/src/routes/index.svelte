<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
   import App from '$lib/components/App.svelte';

</script>

<div class:inner-canvas={true}>
	<div class:recipe={true}>
		<App />
	</div>
</div>

<style>
	.inner-canvas {
		background: white;
		/*border-radius:2px;*/
		width: 600px;
		font-family: 'Raleway';
		height: 100%;
		padding: 0.5em;
		overflow-y: auto;
		
	}

    .recipe {
		padding: 20px;
	}
</style>
