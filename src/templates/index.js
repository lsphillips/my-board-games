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

			<link href="styles/index.css?${hash}" type="text/css" rel="stylesheet" />

			<link rel="icon" href="favicon/32x32.png?${hash}" sizes="32x32" />
			<link rel="icon" href="favicon/128x128.png?${hash}" sizes="128x128" />
			<link rel="icon" href="favicon/192x192.png?${hash}" sizes="192x192" />
			<link rel="icon" href="favicon/512x512.png?${hash}" sizes="512x512" />

			<link rel="apple-touch-icon" href="favicon/180x180.png?${hash}" />

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
