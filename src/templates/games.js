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

function renderGame ({
	name,
	uri,
	thumbnail,
	players,
	expansions,
	location,
	favourite
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
		${ favourite ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="game__favourite">
			<title>
				One of my favourites
			</title>
			<path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
		</svg>` : '' }
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
			>
				${ renderGame(game) }
			</li>`, '') }
		</ul>
		<p class="games__no-matching-games">
			None of my board games matched your criteria!
		</p>
	</div>`;
}
