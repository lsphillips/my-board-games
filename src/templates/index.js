import {
	renderReusableIcons
} from './icons.js';
import {
	renderHeader
} from './header.js';
import {
	renderFinder
} from './finder.js';
import {
	renderGames
} from './games.js';
import {
	renderFooter
} from './footer.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export function renderIndex ({
	games,
	stats,
	timestamp
}, {
	stylesheet,
	script,
	favicon,
	manifest
})
{
	return `<!DOCTYPE html>

	<html>

		<head>

			<title>
				Luke S. Phillips - My Board Games
			</title>

			<meta charset="utf-8" />

			<meta name="viewport" content="width=device-width,initial-scale=1" />

			<meta name="theme-color" content="#171a1d" />

			<link rel="icon" href="${ favicon('32x32.png') }" sizes="32x32" />
			<link rel="icon" href="${ favicon('128x128.png') }" sizes="128x128" />
			<link rel="icon" href="${ favicon('192x192.png') }" sizes="192x192" />
			<link rel="icon" href="${ favicon('512x512.png') }" sizes="512x512" />

			<link rel="apple-touch-icon" href="${ favicon('180x180.png') }" />

			<link href="${ stylesheet('index.css') }" rel="stylesheet" />

			<link rel="manifest" href="${ manifest() }" />

		</head>

		<body class="app">

			${ renderReusableIcons() }

			${ renderHeader({
				className : 'app__header'
			}) }

			${ games.length ? renderGames(games, stats, {
				className : 'app__collection'
			}) : '<p class="app__empty"> I don\'t seem to have any board games! </p>' }

			${ renderFooter({
				timestamp,
				className : 'app__footer'
			}) }

			${ renderFinder(stats, {
				className : 'app__finder'
			}) }

			<script type="text/javascript" src="${ script('index.js') }"></script>

		</body>

	</html>`;
}
