<script lang="ts" context="module">
	export const prerender = false;
</script>

<script lang="ts">
	import { RUBBER_BAND_STATE } from './enums';

	const decisionTable = {
		[RUBBER_BAND_STATE.EXTEND]: {
			extend: true
		},
		[RUBBER_BAND_STATE.NONE]: {
			extend: false
		},
		_default: {
			extend: false
		}
	};

    export let state: RUBBER_BAND_STATE;
    let extend: boolean;

    $: {
        const st = Object.assign({}, decisionTable['_default'], decisionTable[state]);
        extend = st.extend;
    }

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
