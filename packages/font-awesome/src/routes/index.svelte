<script lang="ts">
</script>

<ul>
	<li class:fa={true} class:fa-address-book={true} class:fa-2x={true} class:fa-flip={true} />
	<li>fa-address-book</li>
	<li>fa-contact-book</li>
	<li>(flip)</li>
</ul>

<ul>
	<li class:fa={true} class:fa-address-card={true} class:fa-2x={true} class:fa-shake={true} />
	<li>fa-address-card</li>
	<li>fa-contact-card</li>
	<li>fa-vcard</li>
	<li>fa-vcard</li>
	<li>(shake)</li>
</ul>

<ul>
	<li class:fa={true} class:fa-align-center={true} class:fa-2x={true} class:fa-rotate-by={true} class:fa-flip={true}/>
	<li>fa-align-center(flip)</li>
	<li>(flip)</li>
</ul>

<ul>
	<li class:fa={true} class:fa-align-left={true} class:fa-2x={true} class:fa-beat-fade={true} />
	<li>fa-align-left (beat fade)</li>
	<li>(beat-fade)</li>
</ul>

<ul>
	<li class:fa={true} class:fa-align-left={true} class:fa-2x={true} class:fa-bounce={true} />
	<li>fa-align-left</li>
	<li>(bounce)</li>
</ul>

<ul>
	<li class:fa={true} class:fa-align-right={true} class:fa-2x={true} class:fa-beat={true} />
	<li>fa-align-right</li>
	<li>(beat)</li>
</ul>

<ul>
	<li class:fa={true} class:fa-anchor={true} class:fa-2x={true} class:fa-beat={true} />
	<li>fa-anchor</li>
	<li>(pulse)</li>
</ul>

<ul style="--fa-animation-direction: reverse">
	<li class:fa={true} class:fa-anchor-circle-check={true} class:fa-2x={true} class:fa-spin={true}  />
	<li>fa-anchor-circle-check</li>
	<li>(spin + spin-reverse)</li>
</ul>

<ul >
	<li class:fa={true} class:fa-anchor-circle-exclamation={true} class:fa-2x={true} class:fa-spin={true} />
	<li>fa-anchor-circle-exclamation</li>
	<li>(spin-pulse)</li>
</ul>

<ul >
	<li class:fa={true} class:fa-anchor-circle-xmark={true} class:fa-2x={true} />
	<li>fa-anchor-circle-exclamation</li>
	<li>(spin-pulse)</li>
</ul>



<style>
	:host {
		font-family: 'Font Awesome 6 Free';
		
	}

	:root {
		--not-active-fa-rotate-angle: 30deg;
		
	}

	:global(ul) > :global(li):nth-child(1) {
		display: table-cell;
		list-style-type: none;
	}

	:global(ul) > :global(li):nth-child(2),
	:global(ul) > :global(li):nth-child(3),
	:global(ul) > :global(li):nth-child(4),
	:global(ul) > :global(li):nth-child(5),
	:global(ul) > :global(li):nth-child(6)
	{
		display: table-row;
		font-family: 'Sans Serif';
		font-size: 12px;
		list-style-type: none;
	}
</style>
