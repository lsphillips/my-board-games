import {
	posix
} from 'node:path';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function join (base, ...paths)
{
	let url = posix.join(...paths);

	if (
		!url.startsWith('/')
	)
	{
		url = posix.join(base, url);
	}

	return url;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export function createUrlBuilder ({
	base,
	js,
	css,
	favicons,
	manifest
}, hash)
{
	return {
		script     : path => join(base, js, path)       + '?' + hash,
		stylesheet : path => join(base, css, path)      + '?' + hash,
		favicon    : path => join(base, favicons, path) + '?' + hash,
		manifest   : ()   => join(base, manifest)       + '?' + hash
	};
}
