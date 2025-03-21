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

function isDeveloping ()
{
	return process.argv[2]?.toLowerCase() === 'develop';
}

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

async function buildCssAndJs (outdir)
{
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
	}
	else
	{
		await build(config);
	}
}

async function copyResources (outdir)
{
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
		observe('src/resources', copy);
	}
}

async function renderTemplates (outdir, gamelist)
{
	await render(outdir, {
		...gamelist, timestamp : Date.now()
	});

	if (
		isDeveloping()
	)
	{
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

				await render(workerData.outdir, {
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Load gamelist.
const gamelist = await collect('gamelist.yml');

// Render templates.
await renderTemplates('build', gamelist);

// Copy resources.
await copyResources('build');

// Build CSS & JS.
await buildCssAndJs('build');
