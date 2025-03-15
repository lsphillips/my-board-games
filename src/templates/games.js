function renderCount (count, one, many, zero = many)
{
	switch (count)
	{
		case 0 :
			return `${count} ${zero}`;

		case 1 :
			return `${count} ${one}`;

		default :
			return `${count} ${many}`;
	}
}

function renderPlayerCount (min, max)
{
	if (min >= max)
	{
		return min === 1 ? '1 player' : `${min} players`;
	}

	return `${min} - ${max} players`;
}

function renderThumbnail (url, className)
{
	return `<div class="thumbnail ${className}">
		<img class="thumbnail__image" src="${url}" alt="" />
	</div>`;
}

function renderExpansion ({
	name,
	uri,
	thumbnail,
	players,
	location
})
{
	return `<article class="expansion">
		${ renderThumbnail(thumbnail, 'expansion__thumbnail') }
		<div class="expansion__info">
			<h2 class="expansion__name">
				<a href="${uri}" target="_blank" class="expansion__uri">
					${name}
				</a>
			</h2>
			<small class="expansion__metadata">
				<span class="expansion__player-count" aria-label="Player Count">
					${ renderPlayerCount(players.min, players.max) }
				</span>
				&middot;
				<span class="expansion__player-count" aria-label="Location">
					${location}
				</span>
			</small>
		</div>
	</article>`;
}

function renderExpansions (expansions)
{
	if (!expansions?.length)
	{
		return '';
	}

	return `<ul class="game__expansions">
		${ expansions.reduce((acc, expansion) => acc + `<li class="game__expansion"
			data-min-players="${expansion.players.min}"
			data-max-players="${expansion.players.max}"
			${ expansion.accessible ? 'data-accessible' : '' }
		>
			${ renderExpansion(expansion) }
		</li>`, '') }
	</ul>`;
}

function renderFavouriteIcon ()
{
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="game__favourite">
		<title>
			One of my favourites
		</title>
		<path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
	</svg>`;
}

function renderBgaLink (bgaUri)
{
	return `<a href="${bgaUri}" target="_blank" class="game__bga">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="75 0 960 960">
			<title>
				Available to play on Board Game Arena
			</title>
			<defs>
				<linearGradient id="gradient" x1="25.953" x2="993.953" y1="927.172" y2="-140.828" gradientUnits="userSpaceOnUse">
					<stop offset="0" stop-color="#36A9E1" />
					<stop offset=".148" stop-color="#00ABE9" />
					<stop offset=".683" stop-color="#82519C" />
					<stop offset="1" stop-color="#B50F80" />
				</linearGradient>
			</defs>
			<path fill="url(#gradient)" d="M109.47 678.14c4.22-15.61 6.97-31.82 13.06-46.75 14.93-37.03 43.02-61.69 78.68-78.39 3.83-1.76 5.2-3.33 4.12-7.95-11.98-51.57-10.11-102.75 4.91-153.44.58-1.86-.58-5.69-2.06-6.38-63.36-31.23-80.35-103.14-40.57-165.52 41.65-65.42 131.53-95.97 200.59-67.68 13.94 5.69 25.93 16.11 39.09 24.16 2.06 1.27 5.5 2.06 7.66 1.27 58.35-21.61 118.27-27.89 179.86-18.95 1.47.19 3.92-1.08 4.61-2.35 26.22-52.94 71.51-76.81 127.8-82.41 49.41-4.91 94.69 7.17 133.69 38.7 28.29 22.79 46.36 51.96 48.82 88.9 2.75 41.06-14.63 73.57-45.97 99.02-9.72 7.95-20.92 14.04-31.53 21.12 5.3 12.57 11.39 25.63 16.4 39.19 10.41 28.09 16.11 57.27 16.79 87.23.19 7.07 2.65 10.7 8.84 14.04 64.14 34.28 105.89 86.64 122.89 157.47 23.47 97.74-24.95 194.4-115.52 228.59-78.19 29.56-150.59 14.04-216.31-35.16-15.22-11.39-27.6-26.62-41.45-39.88-1.76-1.66-5.2-3.04-7.26-2.55-98.03 25.14-190.87 13.45-277.7-39.58-.58-.39-1.17-.58-1.76-.88-6.48 8.34-12.27 17.19-19.35 24.95-28.78 31.63-64.44 48.62-107.66 47.25-48.72-1.57-92.04-41.45-98.62-89.78-.58-4.42-1.37-8.84-2.06-13.26zm316.9-479.68c3.92 11.98 7.95 21.41 10.21 31.33 5.1 22.59 4.42 44.59-11.88 63.26-2.55 2.94-6.87 5.79-10.6 6.09-11.1.88-15.12-6.38-12.96-20.23 1.47-9.52 4.22-19.45 2.94-28.68-3.14-22-18.27-35.95-36.54-46.46-54.81-31.43-130.65-2.84-155.01 58.25-17.97 44.89 5.99 91.65 53.14 102.16 13.75 3.04 28.19 3.24 42.24 4.81 11.1 1.27 16.89 6.48 17.28 16.3.09 2.16-2.35 5.79-4.42 6.38-22.1 6.77-44.69 9.03-67.78 6.48-1.57-.19-4.61 1.66-4.91 3.04-8.74 43.91-6.09 87.03 8.64 129.47 3.14 8.93 6.87 15.42 17.28 15.71 3.24.09 6.67.98 9.43 2.55 1.57.88 3.43 4.02 2.94 5.59-2.25 8.34-8.54 12.08-16.79 13.26-11.68 1.57-23.67 1.86-34.97 4.91-33.98 9.23-54.12 33.39-65.52 65.42-10.9 30.45-1.17 67.68 22.49 88.5 22.1 19.35 53.24 22.1 84.08 5.89 25.73-13.55 45.97-32.51 51.57-62.67 1.96-10.31.98-21.12 3.04-31.43.68-3.63 6.18-7.66 10.11-8.74 2.45-.68 7.26 3.33 9.33 6.48 2.55 3.73 2.94 8.84 5.1 12.96 2.16 4.02 4.71 8.64 8.34 10.9 51.37 31.43 107.56 44 167.39 40.47 16.99-.98 33.79-4.22 51.18-6.48-.88-3.43-1.37-5.4-1.96-7.36-9.82-36.93-10.51-73.87-.19-110.8.58-2.16 2.94-5.3 4.61-5.4 14.24-.39 23.77 6.28 27.7 20.23 2.45 8.74 3.92 17.87 4.91 27.01 4.22 39.78 19.25 73.77 50 100.59 52.35 45.67 121.41 53.53 177.11 16.89 43.32-28.48 66.01-69.05 59.03-121.9-7.26-55.4-38.99-94.69-86.44-122.1-21.51-12.37-44.69-16.4-69.64-11.39-9.82 1.96-20.53 2.06-30.35.19-5.1-.98-10.31-7.46-13.06-12.77-3.14-5.99 1.37-11.29 6.58-14.83 13.75-9.33 28.58-16.3 45.67-16.69 14.63-.29 29.27-.09 44.2-.09-.09.49.09 0 .09-.49.49-34.28-6.09-67.09-19.84-98.43-.78-1.86-3.63-3.33-5.79-3.92-6.18-1.57-12.57-2.35-18.76-3.73-6.48-1.47-10.41-6.38-9.03-12.47.88-4.12 4.81-9.23 8.64-10.6 9.33-3.33 19.35-4.91 29.17-6.97 55.3-11.29 80.94-81.53 46.46-127.41-35.75-47.74-119.45-58.54-167.39-21.31-21.9 16.99-36.83 38.5-33.98 67.97 1.08 11.1 4.22 22 6.67 33 2.65 12.47-1.47 20.62-13.16 24.36-1.76.58-5-.09-6.09-1.47-18.66-23.28-28.58-49.8-26.71-79.76.39-6.48-1.66-7.66-7.17-8.64-30.64-5.3-61.49-6.38-92.14-1.57-21.51 3.63-42.92 9.52-64.54 14.34z" />
		</svg>
	</a>`;
}

function renderGame ({
	name,
	uri,
	thumbnail,
	players,
	expansions,
	location,
	favourite,
	bgaUri
})
{
	return `<article class="game">
		${ renderThumbnail(thumbnail, 'game__thumbnail') }
		<div class="game__info">
			<h2 class="game__name">
				<a href="${uri}" target="_blank" class="game__uri">
					${name}
				</a>
			</h2>
			<small class="game__metadata">
				<span class="game__player-count" aria-label="Player Count">
					${ renderPlayerCount(players.min, players.max) }
				</span>
				&middot;
				<span class="game__player-location" aria-label="Location">
					${location}
				</span>
			</small>
		</div>
		<div class="game__icons">
			${ favourite ? renderFavouriteIcon() : '' }
			${ bgaUri ? renderBgaLink(bgaUri) : '' }
		</div>
		${ renderExpansions(expansions) }
	</article>`;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export function renderGames (games, stats, {
	className = ''
} = {})
{
	return `<div class="games ${className}">
		<p class="games__summary">
			Showing <span class="games__game-count">
				${ renderCount(stats.gameCount, 'game', 'games') }
			</span> with <span class="games__expansion-count">
				${ renderCount(stats.expansionCount, 'expansion', 'expansions') }
			</span>
		</p>
		<ul class="games__collection">
			${ games.reduce((acc, game) => acc + `<li class="games__item"
				data-min-players="${game.players.min}"
				data-max-players="${game.players.max}"
				${ game.accessible ? 'data-accessible' : '' }
				${ game.quick ? 'data-quick' : '' }
				${ game.bgaUri ? 'data-bga' : '' }
			>
				${ renderGame(game) }
			</li>`, '') }
		</ul>
		<p class="games__no-matching-games">
			None of my board games matched your criteria!
		</p>
	</div>`;
}
