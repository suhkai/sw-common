<script context="module" lang="ts">
	export const prerender = true;
	const storageDriver = new LocalStorageDriver();
    const connector = storageDriver.getConnector();
	let i = 1;
	console.log(`${i++}:context module has run`);
</script>

<script lang="ts">
	// 3rd party
	import { onMount } from "svelte";
	// app
    import { LocalStorageDriver } from '$lib/dao/LocalStorageDriver';
    import App from '$lib/components/App.svelte';
	
	onMount(() => {
	   console.log(`${i++}: onMount connector value: ${!!connector}`);
 	   connector.loadAll();
	});
</script>

<div class:inner-canvas={true}>
	<div class:recipe={true}>
	  <App {connector} />
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
