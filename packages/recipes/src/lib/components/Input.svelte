<script lang="ts" context="module">
	export const prerender = false;

	export const INPUT_STATE = {
		NONE: 1, // do not show input box
		ADD: 2, // show input box green background
		MODIFY: 4, // show input box yellow background
		SHOW: 8, // show input box transparent background
		// undef
		UNDEF: 16 // show input pink orange background
	};
</script>

<script lang="ts">
	export let state: number;
	export let isRecipe: boolean;
	export let value: string;
	export let seq: number;
	export let forceFocus: boolean;

	$: adding = (state & (INPUT_STATE.ADD | INPUT_STATE.UNDEF)) > 0;
	$: extend =
		(state & (INPUT_STATE.ADD | INPUT_STATE.MODIFY | INPUT_STATE.SHOW | INPUT_STATE.UNDEF)) > 0;
	$: modifying = (state & (INPUT_STATE.MODIFY | INPUT_STATE.UNDEF)) > 0;
	$: placeHolder = isRecipe ? 'Enter New Recipe Name' : 'Enter Ingredient or Empty[Enter] to save';

	function setFocus(node: HTMLInputElement, focusValue) {
		if (focusValue) {
			console.log('setting focus');
			node.focus();
		} else {
			console.log('setting blur');
			node.blur();
		}
		return {
			update(newFocusValue: boolean) {
				console.log(`Xupdate:${newFocusValue}`);
				if (newFocusValue) {
					console.log('Xsetting focus:' + newFocusValue);
					node.focus();
				} else {
					console.log('Xsetting blur:' + newFocusValue);
					node.blur();
				}
			}
		};
	}
</script>

<input
	type="text"
	class:base={true}
	class:isRecipe
	class:extend
	class:adding
	class:modifying
	placeholder={placeHolder}
	bind:value
	tabindex={seq}
	on:blur
	on:focus
	use:setFocus={forceFocus}
/>

<style>
	.base {
		font-family: 'Open Sans';
		font-weight: 300;
		overflow: hidden;
		text-overflow: ellipsis;
		/*flex-shrink: 0;*/
		flex-grow: 0;
		padding: 0;
		transition: all 0.2s linear;
		background-color: transparent;
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-khtml-user-select: none; /* Konqueror HTML */
		-moz-user-select: none; /* Old versions of Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
	}

	.base:not(.extend) {
		width: 0px;
	}

	/* size of recipe */
	.base.isRecipe.extend {
		width: calc(100% - var(--line-height-new-entry) * 2);
		padding: 0 0.125em 0 0.125em;
	}

	.base.isRecipe {
		line-height: var(--line-height-new-entry);
		font-size: calc(var(--line-height-new-entry) * 0.7);
		height: var(--line-height-new-entry);
	}

	/* mutally exclusive, input is for recipe or ingredient */
	.base:not(.isRecipe) {
		line-height: var(--line-height-new-entry-detail);
		font-size: calc(var(--line-height-new-entry-detail) * 0.7);
		height: var(--line-height-new-entry-detail);
	}

	.base:not(.isRecipe).extend {
		width: calc(100% - var(--line-height-new-entry-detail) - var(--line-height-new-entry) - 1px);
		padding: 0 0.125em 0 0.125em;
	}

	.adding:not(.modifying) {
		background-color: rgb(221, 255, 230); /*greenish*/
	}

	.modifying:not(.adding) {
		background-color: #ffffe0; /* yellowish*/
	}

	.adding.modifying {
		background-color: lightcoral;
	}
</style>
