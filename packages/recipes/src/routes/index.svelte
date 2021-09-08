<script context="module" lang="ts">
	import { LocalStorageDriver } from '$lib/dao/LocalStorageDriver';

	export const prerender = true;
	// singletons so belongs here
	const storageDriver = new LocalStorageDriver();
    const connector = storageDriver.getConnector();
</script>

<script lang="ts">
	// app
    import App from '$lib/components/App.svelte';
	import { setContext } from 'svelte';
	
	setContext('connector', connector);
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
