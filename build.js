import {
	watch
} from 'node:fs';
import {
	cp
} from 'node:fs/promises';
import {
	join
} from 'node:path';
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

function observe (path, handler)
{
	let working = false,
		queuing = false;

	watch(path, { recursive : true }, async function work ()
	{
		if (working)
		{
			queuing = true;

			return;
		}

		working = true;
		queuing = false;

		await handler();

		working = false; // eslint-disable-line require-atomic-updates

		if (queuing)
		{
			work();
		}
	});
}

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

// Load gamelist.
const gamelist = await collect('gamelist.yml');

// Copy favicons.
await cp('src/favicon', join(outdir, 'favicon'), {
	recursive : true
});

// Build HTML pages.
await render(outdir, gamelist);

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
	observe('src/templates', () => new Promise(resolve =>
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

		worker.on('error', error =>
		{
			console.error(error);

			resolve();
		});

		worker.on('exit', resolve);
	}));

	// Start watching favicons.
	observe('src/favicon', () => cp('src/favicon', join(outdir, 'favicon'), {
		recursive : true
	}));
}
else
{
	// Build JS & CSS.
	await build(config);
}
