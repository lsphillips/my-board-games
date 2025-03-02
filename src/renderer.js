import {
	mkdir,
	writeFile
} from 'node:fs/promises';
import {
	join
} from 'node:path';
import nano from 'htmlnano';
import {
	renderIndex
} from './templates/index.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function render (outdir, {
	games,
	stats
})
{
	await mkdir(outdir, {
		recursive : true
	});

	const page = await nano.process(
		renderIndex({
			games,
			stats
		}),
		{
			collapseAttributeWhitespace : true,
			collapseWhitespace          : 'aggressive',
			deduplicateAttributeValues  : true,
			removeComments              : 'all',
			removeEmptyAttributes       : true,
			removeAttributeQuotes       : false,
			removeUnusedCss             : true,
			minifyCss                   : false,
			minifyJs                    : false,
			minifyJson                  : true,
			minifySvg                   : false,
			minifyConditionalComments   : true,
			removeRedundantAttributes   : true,
			collapseBooleanAttributes   : true,
			mergeStyles                 : false,
			mergeScripts                : false,
			sortAttributesWithLists     : false,
			sortAttributes              : true,
			minifyUrls                  : false,
			removeOptionalTags          : false,
			normalizeAttributeValues    : false
		}
	);

	await writeFile(join(`${outdir}/index.html`), page.html, 'utf8');
}
