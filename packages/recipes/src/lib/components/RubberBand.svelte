<script lang="ts" context="module">
	export const prerender = false;
	export const RUBBER_BAND_STATE = {
		NONE: 1,
		EXTEND: 2
	};
</script>

<script lang="ts">
	export let state: number;
    $: extend = (state & RUBBER_BAND_STATE.EXTEND) > 0;
</script>
   
<div class:plain-filler={true} class:extend></div>

<style>
	.plain-filler {
		height: var(--line-height-new-entry);
		flex-grow: 0;
	}

	.plain-filler:not(.extend) {
		width: 0;
	}

	.plain-filler.extend {
		width: 100%;
	}

	.plain-filler {
		transition: all 0.2s linear;
	}
</style>
