<script lang="ts">
	import { onMount } from 'svelte';
	import css from 'css';
	import jxpath from '@mangos/jxpath';
	import cssText from '$lib/css';

	let contentClassMap = new Map<string, Set<string>>();

	onMount(() => {
		var obj = css.parse(cssText);
		const iteratorRules = jxpath('/stylesheet/rules/[type=rule]/', obj);
		for (const rule of iteratorRules) {
			// find decleration type "content"

			const contentDeclaration = Array.from(
				jxpath('/declarations/[property=content]/[type=declaration]/value', rule)
			);
			if (contentDeclaration.length === 1) {
				const content: string = contentDeclaration[0] as string;
				const selectors: string[] = Array.from(jxpath('/selectors', rule));
				for (const selector of selectors) {
					const existingSelectors = contentClassMap.get(content) || new Set();
					
					if (/::/.test(selector)){
						existingSelectors.add(selector.slice(1).replace(/::before/, ''));
						
					}
					else if (/:/.test(selector)){
						existingSelectors.add('fa-brands '+selector.slice(1).replace(/:before/, ''));
					}
					else {
						continue;
					}
					contentClassMap.set(content, existingSelectors);
				}
			} else {
				if (contentDeclaration.length) {
					throw new Error(
						`nr contentDeclaration > 0 && !==1, [${
							contentDeclaration.length
						}], for rule:${rule.selectors.join(' ')}`
					);
				}
			}
		}
		contentClassMap = contentClassMap;
	});
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
	<li
		class:fa={true}
		class:fa-align-center={true}
		class:fa-2x={true}
		class:fa-rotate-by={true}
		class:fa-flip={true}
	/>
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
	<li class:fa={true} class:fa-anchor-circle-check={true} class:fa-2x={true} class:fa-spin={true} />
	<li>fa-anchor-circle-check</li>
	<li>(spin + spin-reverse)</li>
</ul>

<ul>
	<li
		class:fa={true}
		class:fa-anchor-circle-exclamation={true}
		class:fa-2x={true}
		class:fa-spin={true}
	/>
	<li>fa-anchor-circle-exclamation</li>
	<li>(spin-pulse)</li>
</ul>

<ul>
	<li class:fa={true} class:fa-anchor-circle-xmark={true} class:fa-2x={true} />
	<li>fa-anchor-circle-exclamation</li>
	<li>(spin-pulse)</li>
</ul>

<div class="gridbox">
	{#each [...contentClassMap.entries()] as contentEntry, i}
		<ul>
			{#each [...contentEntry[1].keys()] as classEntry, j}
				{#if j === 0}
					<li class="fa fa-2x {classEntry}" />
				{/if}
				<li>{classEntry}</li>
			{/each}
		</ul>
	{/each}
</div>

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
	:global(ul) > :global(li):nth-child(6) {
		display: table-row;
		font-family: 'Sans Serif';
		font-size: 12px;
		list-style-type: none;
	}
	.gridbox {
		display:grid;
		width: 100%;
/*		gap: 10px;
    	grid-auto-flow: column;
		grid-auto-columns: max-content;*/

		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  grid-auto-flow: dense;

	}
</style>
