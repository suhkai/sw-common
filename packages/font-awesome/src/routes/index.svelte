<script lang="ts">
	import Envelope from '$lib/envelope.svelte';
	import Clear from '$lib/clear.svelte';
	import RedCross from '$lib/redcross.svelte';
	import Check from '$lib/check.svelte';

	const redEnvelope = '#E2001F';
	const greyEnvelope = '#646464';

	let inputTag: HTMLInputElement;
	let focus = false;
	let emailValue = '';
    let clearBtn: HTMLDivElement;

	$: emailValid = validate(emailValue);
	$: empty = emailValue.trim() === '';

	function validate(str = ''): boolean {
		if (str.trim() === '') {
			return true;
		}
		if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(str)) {
			return true;
		}
		return false;
	}

	function onBlur(e: FocusEvent) {
		console.log(`/event/blur: fired, focus=${focus}`);
        if (e.relatedTarget === clearBtn){
            return;
        }
        focus = false;
	}

	function onFocus(e: FocusEvent) {
		focus = true;
		console.log('/event/focus: fired');
		console.log(`/event/focus: emailValue=[${emailValue}]`);
		console.log('/event/focus: about the get focus', e.target);
		console.log('/event/focus: about to loose focus', e.relatedTarget);
	}

	$: {
		console.log('empty:', empty);
		console.log('error:', !emailValid);
		console.log('emailValue:', emailValue);
		console.log('focus value=', focus);
	}
	function clickClear() {
		console.log('/event/click clear pressed', arguments);
        emailValue = '';
        inputTag.focus();
	}

    let id = 'input' + Math.random();
</script>

<div class:rich-edit-control={true} class:error={!emailValid} class:focus class:empty
on:focusout={onBlur} on:focusin={onFocus}>
	<label class:left-icon-placer={true} for={id}>
		<Envelope />
	</label>
	<input
        tabIndex={0}
		{id}
		bind:this={inputTag}
		bind:value={emailValue}
		type="email"
		placeholder="Enter your email..."
		autocomplete="on"
	/>
	<div bind:this={clearBtn} tabIndex={0} class:right-icon-placer={true} class:clear={true} on:click={clickClear} >
        <Clear />
	</div>
	<div class:right-icon-placer={true} class:red-cross={true}>
		<RedCross />
	</div>
	<div class:right-icon-placer={true} class:check={true}>
		<Check />
	</div>
</div>

<style>
	/* Text */

	.rich-edit-control {
		/* text */
		/* externalize */
		font-family: Helvetica, arial;
		/* externalize */
		font-style: normal;
		/* externalize */
		font-weight: 400;
		/* externalize */
		font-size: 14px;

		line-height: calc(19em / 14);

		/* debug purpose */
		height: calc(48em / 14);

		/* position items */
		display: flex;
		align-items: center; /* vertically in the middle */
		justify-items: start; /* horizontally from the start*/

		min-width: fit-content;
	}

	.rich-edit-control.focus:not(.error) {
		background: transparent;
		outline: 2px solid green;
	}

	.rich-edit-control.focus.error {
		background: #fed7d2;
		outline: 2px solid red;
	}

	.left-icon-placer {
		width: calc(54em / 14);
		height: fit-content; /* will be align to vertical center */
		padding-left: calc(10em / 14);
		flex-grow: 0;
	}

	.left-icon-placer > :global(svg) {
		width: calc(14.08em / 14);
		height: calc(9.75em / 14);
	}

	.right-icon-placer {
		margin-right: 1em;
		justify-self: end;
		width: fit-content;
		/*outline: 4px orange dashed;*/
	}

	.right-icon-placer.clear {
		height: calc(20em / 14);
	}

	.right-icon-placer.red-cross {
		height: calc(21em / 14);
	}

	.right-icon-placer.clear > :global(svg) {
		width: calc(20em / 14);
		height: calc(20em / 14);
	}

	/* behavioral */

	/* red-cross */
	/* red-cross */
	/* red-cross */

	.focus > .right-icon-placer.red-cross,
	.empty > .right-icon-placer.red-cross {
		display: none;
	}

	:not(.focus):not(.error) > .right-icon-placer.red-cross {
		display: none;
	}

	/* in all other cases display red cross */

	/* clear */
	/* clear */
	/* clear */

	:not(.focus) > .right-icon-placer.clear {
		display: none;
	}

	.error.focus > .right-icon-placer.clear > :global(svg) :global(path) {
		fill: black;
	}

	/* in all other cases it will display with color gray (cbcbcb) */

	/* envelope */
	/* envelope */
	/* envelope */

	.error.focus > .left-icon-placer > :global(svg) :global(path) {
		fill: #e2001f;
	}

	/* check */
	/* check */
	/* check */

	.focus > .right-icon-placer.check {
		display: none;
	}

	.error:not(.focus) > .right-icon-placer.check,
	.empty:not(.focus) > .right-icon-placer.check {
		display: none;
	}

	/*:not(.focus).error > .right-icon-placer.red-cross {
    display: block;
}*/

	/* start: things that should happen when not in focus (error or no error) */

	/*.rich-edit-control:not(.focus) > .right-icon-placer.clear {
    display: none;
}

/* start: not in focus and an error */
	/*
.rich-edit-control.error:not(.focus) > .right-icon-placer.red-cross {
    display: block;
}









/* end "error and in focus" */

	/*.focus > .right-icon-placer.red-cross {
    display: none;
}



:not(.error).focus > .right-icon-placer.clear > :global(svg) :global(path) {
    fill: #cbcbcb;
}*/

	.rich-edit-control > :global(input) {
		font-family: inherit;
		font-size: 1em;
		outline: none;
		margin: 0;
		border: none;
		padding: 0;
		height: fit-content;
		line-height: calc(24em / 14);
		flex-grow: 1;
		background: transparent;
		text-overflow: ellipsis;
		margin-right: 1em;
	}
</style>
