<script lang="ts">
	import Key from '$lib/key.svelte';
	import Eye from '$lib/eye.svelte';
	import EyeSlash from '$lib/eyeslash.svelte';
	import Clear from '$lib/clear.svelte';
	import RedCross from '$lib/redcross.svelte';
	import Check from '$lib/check.svelte';

	let inputTag: HTMLInputElement;
	let focus = false;
	let passwordValue = '';
	let tagClearBtn: HTMLDivElement;
	let tagEyeBox: HTMLDivElement;
	let showPassword = false;

	$: passwordValid = validate(passwordValue);
	$: empty = passwordValue.trim() === '';

	function validate(str = ''): boolean {
		if (str.trim() === '') {
			return true;
		}

		if (str.length < 8 || str.length > 12) {
			return false;
		}

		const numberCount = str.match(/[0-9]/g);
		if (numberCount === null) {
			return false;
		}
		const specialChars = str.match(/[!#@]/g);
		if (specialChars === null) {
			return false;
		}

		return true;
	}

	function onBlur(e: FocusEvent) {
		console.log(`/event/blur: fired, focus=${focus}`);
		if (e.relatedTarget === tagClearBtn) {
			return;
		}
        if (e.relatedTarget === tagEyeBox) {
			return;
		}
		focus = false;
	}

	function onFocus(e: FocusEvent) {
		focus = true;
		console.log('/event/focus: fired');
		console.log(`/event/focus: passwordValue=[${passwordValue}]`);
		console.log('/event/focus: about the get focus', e.target);
		console.log('/event/focus: about to loose focus', e.relatedTarget);
	}

	$: {
		console.log('empty:', empty);
		console.log('error:', !passwordValid);
		console.log('emailValue:', passwordValue);
		console.log('focus value=', focus);
		console.log('show password=', showPassword);
	}

	function clickClear() {
		console.log('/event/click clear pressed', arguments);
		passwordValue = '';
		inputTag.focus();
        focus = true;
	}

	function togglePassword() {
		console.log('/event/click view password toggle', arguments);
		showPassword = !showPassword;
		inputTag.type = showPassword === true ? 'text' : 'password';
        inputTag.focus();
        focus = true;
	}

	let id = 'input' + Math.random();
</script>

<div
	class:rich-edit-control={true}
	class:error={!passwordValid}
	class:focus
	class:empty
	on:focusout={onBlur}
	on:focusin={onFocus}
>
	<label class:left-icon-placer={true} for={id}>
		<Key />
	</label>
	<input
		tabIndex={0}
		{id}
        type='password'
		name="password"
		bind:this={inputTag}
		bind:value={passwordValue}
		placeholder="Create a password..."
	/>
	<div
		bind:this={tagClearBtn}
		tabIndex={0}
		class:right-icon-placer={true}
		class:clear={true}
		on:click={clickClear}
	>
		<Clear />
	</div>
	<div
		bind:this={tagEyeBox}
		tabIndex={0}
		class:right-icon-placer={true}
		class:eye={true}
        class:slash={showPassword}
		on:click={togglePassword}
	>
		{#if showPassword}
			<EyeSlash />
		{:else}
			<Eye />
		{/if}
	</div>
	<div class:right-icon-placer={true} class:red-cross={true}>
		<RedCross />
	</div>
	<div class:right-icon-placer={true} class:check={true}>
		<Check />
	</div>
</div>

<style>
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
		height:  calc(17em / 14);
		padding-left: calc(10em / 14);
		flex-grow: 0;
	}

    .left-icon-placer > :global(svg) {
		width: calc(16em / 14);
		height: calc(17em / 14);
	}

    .right-icon-placer {
		margin-right: 1em;
		justify-self: end;
		width: fit-content;
        height: fit-content;
		/*outline: 4px orange dashed;*/
	}

	/* done */
    .right-icon-placer.clear {
		height: calc(20em / 14);
        margin-right: calc(20em/14);
	}

	/* done */
    .right-icon-placer.clear > :global(svg) {
		/* width: calc(20em / 14); */
		height: calc(20em / 14);
	}

	/* done */
    .right-icon-placer.red-cross {
		height: calc(21em / 14);
	}

    .right-icon-placer.eye {
		height: calc(15em / 14);
        width: calc(21em / 14);
        /*outline: 4px dashed orange;*/
	}

    .right-icon-placer.eye.slash {
		height: calc(18em / 14);
        width: calc(21em / 14);
	}

    .right-icon-placer.check {
		height: calc(21em / 14);
	}

    .right-icon-placer.check > :global(svg) {
		width: calc(21em / 14);
		height: calc(21em / 14);
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

    /* key */
	/* key */
	/* key */

	.error.focus > .left-icon-placer > :global(svg) :global(path) {
		fill: #e2001f;
	}


	/* clear */
	/* clear */
	/* clear */

	/* done */
	:not(.focus) > .right-icon-placer.clear {
		display: none;
	}

	/* done */
	.error.focus > .right-icon-placer.clear > :global(svg) :global(path) {
		fill: black;
	}

    /* eye */
	/* eye */
	/* eye */

	/* done */
    :not(.focus) > .right-icon-placer.eye {
		display: none;
	}
	/* done */
	.error.focus > .right-icon-placer.eye > :global(svg) :global(path) {
		fill: black;
	}



</style>
