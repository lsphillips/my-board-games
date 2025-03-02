import {
	watch
} from 'node:fs';
import {
	Worker
} from 'node:worker_threads';
import {
	build,
	context
} from 'esbuild';
import {
	collect
} from './src/collector.js';
import {
	render
} from './src/renderer.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function isDeveloping ()
{
	return process.argv[2]?.toLowerCase() === 'develop';
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const outdir = 'build';
const config =
{
	outdir,

	entryPoints : [
		'src/scripts/index.js',
		'src/styles/index.css'
	],

	bundle : true,

	minify : true,

	jsx : 'automatic',

	target : [
		'es2022'
	],

	format : 'esm',

	sourcemap : false
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const gamelist = await collect('gamelist.yml');

if (
	isDeveloping()
)
{
	const {
		serve
	} = await context({ ...config, sourcemap : 'linked' });

	// Start build server.
	serve({
		port : 1992,
		servedir : outdir
	});

	// Start watching templates.
	//
	// Because we use JS for our "templates" they will be
	// cached. With no way to purge this cache we need to
	// perform re-renders in another process.
	//
	// To ensure we don't spin up too many workers we only
	// want one render occurring at any given point.
	let rendering = false, queued = false;

	watch('src/templates', { recursive : true }, async function rerender ()
	{
		if (rendering)
		{
			queued = true;

			return;
		}

		rendering = true;
		queued    = false;

		await new Promise((resolve) =>
		{
			const worker = new Worker(`
				import {
					workerData
				} from 'node:worker_threads';
				import {
					render
				} from './src/renderer.js';

				await render(workerData.outdir, workerData.gamelist);
			`, {
				eval : true, workerData : { outdir, gamelist }
			});

			worker.on('error', (error) =>
			{
				console.error(error);

				resolve();
			});

			worker.on('exit', resolve);
		});

		rendering = false; // eslint-disable-line require-atomic-updates

		if (queued)
		{
			rerender();
		}
	});

	// Build initial HTML pages.
	await render(outdir, gamelist);
}
else
{
	// Build JS & CSS.
	await build(config);

	// Build HTML pages.
	await render(outdir, gamelist);
}
