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
	hash
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

			<link href="styles/index.css?${hash}" type="text/css" rel="stylesheet" />

			<link rel="icon" href="favicons/32x32.png?${hash}" sizes="32x32" />
			<link rel="icon" href="favicons/128x128.png?${hash}" sizes="128x128" />
			<link rel="icon" href="favicons/192x192.png?${hash}" sizes="192x192" />
			<link rel="icon" href="favicons/512x512.png?${hash}" sizes="512x512" />

			<link rel="apple-touch-icon" href="favicons/180x180.png?${hash}" />

			<link rel="manifest" href="manifest.json?${hash}" />

		</head>

		<body class="app">

			${ renderHeader({
				className : 'app__header'
			}) }

			${ games.length ? renderGames(games, stats, {
				className : 'app__collection'
			}) : '<p class="app__empty"> I don\'t seem to have any board games! </p>' }

			${ renderFooter({
				className : 'app__footer'
			}) }

			${ renderFinder(stats, {
				className : 'app__finder'
			}) }

			<script type="text/javascript" src="scripts/index.js?${hash}"></script>

		</body>

	</html>`;
}
