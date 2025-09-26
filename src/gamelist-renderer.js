import {
	mkdir,
	writeFile
} from 'node:fs/promises';
import {
	join
} from 'node:path';
import * as nano from 'htmlnano';
import {
	createUrlBuilder
} from './url-builder.js';
import {
	renderIndex
} from './templates/index.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function renderGamelist (outdir, { games, stats }, {
	paths,
	timestamp
})
{
	// Ensure output directory exists.
	await mkdir(outdir, {
		recursive : true
	});

	const urls = createUrlBuilder(paths, timestamp);

	const page = await nano.process(
		renderIndex({
			games,
			stats,
			timestamp
		}, urls),
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
