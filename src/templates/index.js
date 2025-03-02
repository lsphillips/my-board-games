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
