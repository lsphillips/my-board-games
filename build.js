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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const outdir = 'website', gamelist = 'gamelist.yml';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function isDeveloping ()
{
	return process.argv[2]?.toLowerCase() === 'develop';
}

function observe (paths, handler)
{
	let working = false,
		queuing = false;

	async function work (_, path)
	{
		if (working)
		{
			queuing = true;

			return;
		}

		working = true;
		queuing = false;

		if (path)
		{
			try
			{
				await handler(path);
			}
			catch (error)
			{
				console.error(error);
			}
		}

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

async function renderPages ()
{
	console.log('Rendering pages.');

	let data;

	async function render (loadGameList)
	{
		if (loadGameList)
		{
			data = await readGamelist(gamelist);
		}

		// Because we use JS for our "templates" they will
		// be cached. With no way to purge this cache we
		// need to perform renders in another process.
		//
		// This isn't really necessary for regular builds
		// but the performance penalty is negligible and
		// using the same approach in all scenarios keeps
		// this solution leaner.
		return new Promise((resolve, reject) =>
		{
			const worker = new Worker(`
				import {
					workerData
				} from 'node:worker_threads';
				import {
					renderPages
				} from './src/page-renderer.js';

				await renderPages(workerData.outdir, {
					...workerData.data, timestamp : Date.now()
				});
			`, {
				eval : true, workerData : { outdir, data }
			});

			worker.on('error', reject);
			worker.on('exit', resolve);
		});
	}

	render(true);

	if (
		isDeveloping()
	)
	{
		observe(['src/templates', gamelist], async path =>
		{
			await render(
				path.endsWith(gamelist)
			);
		});
	}
}

async function copyAssets ()
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

// Render pages.
await renderPages();

// Copy assets.
await copyAssets();

// Build CSS & JS.
await buildCssAndJs();
