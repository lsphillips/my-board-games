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
	readGamelist
} from './src/gamelist-reader.js';
import {
	renderPages
} from './src/page-renderer.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const outdir = 'website';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function isDeveloping ()
{
	return process.argv[2]?.toLowerCase() === 'develop';
}

function observe (paths, handler)
{
	let working = false,
		queuing = false;

	async function work ()
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
	}

	for (const path of paths)
	{
		watch(path, { recursive : true }, work);
	}
}

async function buildPages ()
{
	console.log('Building pages.');

	let gamelist = await readGamelist('gamelist.yml');

	await renderPages(outdir, {
		...gamelist, timestamp : Date.now()
	});

	if (
		isDeveloping()
	)
	{
		// Because we use JS for our "templates" they will be
		// cached. With no way to purge this cache we need to
		// perform re-renders in another process.
		observe(['src/templates', 'gamelist.yml'], () => new Promise(async resolve => // eslint-disable-line no-async-promise-executor
		{
			gamelist = await readGamelist('gamelist.yml');

			const worker = new Worker(`
				import {
					workerData
				} from 'node:worker_threads';
				import {
					renderPages
				} from './src/page-renderer.js';

				await renderPages(workerData.outdir, {
					...workerData.gamelist, timestamp : Date.now()
				});
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
	}
}

async function copyResources ()
{
	console.log('Copying resources and manifest.');

	async function copy ()
	{
		// Copy favicons.
		await cp('src/resources/favicons', join(outdir, 'favicons'), {
			recursive : true
		});

		// Copy manifest.
		await cp(
			'src/resources/manifest.json', join(outdir, 'manifest.json')
		);
	}

	await copy();

	if (
		isDeveloping()
	)
	{
		observe(['src/resources'], copy);
	}
}

async function buildCssAndJs ()
{
	console.log('Building CSS & JS.');

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

	if (
		isDeveloping()
	)
	{
		const {
			serve
		} = await context({ ...config, sourcemap : 'linked' });

		serve({
			port     : 1992,
			servedir : outdir
		});

		console.log('Website is now available locally on port 1992.');
	}
	else
	{
		await build(config);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Build pages.
await buildPages();

// Copy resources.
await copyResources();

// Build CSS & JS.
await buildCssAndJs();
