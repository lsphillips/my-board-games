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
	stats
})
{
	return `<!DOCTYPE html>

	<html>

		<head>

			<title>
				Luke S. Phillips - My Board Game Collection
			</title>

			<meta charset="utf-8" />

			<meta name="viewport" content="width=device-width,initial-scale=1" />

			<link href="styles/index.css" type="text/css" rel="stylesheet" />

			<link rel="icon" href="favicon/32x32.png" sizes="32x32" />
			<link rel="icon" href="favicon/128x128.png" sizes="128x128" />
			<link rel="icon" href="favicon/192x192.png" sizes="192x192" />
			<link rel="icon" href="favicon/512x512.png" sizes="512x512" />

			<link rel="apple-touch-icon" href="favicon/180x180.png" />

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

			<script type="text/javascript" src="scripts/index.js"></script>

		</body>

	</html>`;
}
