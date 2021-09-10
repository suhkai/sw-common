<script lang="ts" context="module">
	export const prerender = false;
	export const ARROW_STATE = {
		NONE: 1,
		SHOW: 2,
		DOWN: 4
	};
</script>

<script lang="ts">
	export let state: number;
	$: show = (state & ARROW_STATE.SHOW) > 0;
	$: rotate = (state & ARROW_STATE.DOWN) > 0;
</script>

<div class:arrow={true} class:show class:rotate on:click>
	<svg version="1.1" viewBox="0 0 49.656 49.656">
		<g>
			<polygon
				points="14.535,48.242 11.707,45.414 32.292,24.828 11.707,4.242 14.535,1.414 37.949,24.828 	"
			/>
			<path
				d="M14.535,49.656l-4.242-4.242l20.585-20.586L10.293,4.242L14.535,0l24.829,24.828L14.535,49.656z M13.121,45.414l1.414,1.414l22-22l-22-22l-1.414,1.414l20.585,20.586L13.121,45.414z"
			/>
		</g>
	</svg>
</div>

<style>
	.arrow > svg {
		transition: all 0.2s linear;
	}

	.arrow {
		opacity: 0;
		/* 
            doesn't exist in flex-box, only in grid
            justify-self: flex-end;
        */
	}

	.arrow.show {
		opacity: 1;
	}

	.arrow {
		width: 44px;
		height: 44px;
		position: relative;
	}

	.arrow > svg {
		position: absolute;
		left: 10%;
		top: 10%;
		right: 10%;
		bottom: 10%;
	}

	.arrow > svg polygon,
	.arrow > svg path {
		fill: #48a0dc;
	}

	.rotate.arrow > svg {
		transform: rotate(90deg);
	}

	.arrow {
		/* outline: 2px orange solid;*/
		flex-grow: 0;
		flex-shrink: 0;
	}
</style>
