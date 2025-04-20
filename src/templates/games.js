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
		return min;
	}

	return `${min} - ${max}`;
}

function renderThumbnail (url, className)
{
	return `<div class="thumbnail ${className}">
		<img class="thumbnail__image" src="${url}" alt="" loading="lazy" />
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
				<span class="expansion__players" aria-label="Player Count">
					<svg xmlns="http://www.w3.org/2000/svg" class="expansion__players-icon">
						<use href="#players" />
					</svg>
					${ renderPlayerCount(players.min, players.max) }
				</span>
				<span class="expansion__location" aria-label="Location">
					<svg xmlns="http://www.w3.org/2000/svg" class="expansion__location-icon">
						<use href="#location" />
					</svg>
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

	return `<ul class="game__expansions" aria-label="Game expansions">
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
	favourite,
	bgaUri,
	tabletopiaUri
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
				<span class="game__players" aria-label="Player Count">
					<svg xmlns="http://www.w3.org/2000/svg" class="game__players-icon">
						<use href="#players" />
					</svg>
					${ renderPlayerCount(players.min, players.max) }
				</span>
				<span class="game__location" aria-label="Location">
					<svg xmlns="http://www.w3.org/2000/svg" class="game__location-icon">
						<use href="#location" />
					</svg>
					${location}
				</span>
				${ tabletopiaUri ? `<a href="${tabletopiaUri}" target="_blank" title="Available to play on Tabletopia" class="game__tabletopia">
					<svg xmlns="http://www.w3.org/2000/svg" class="game__tabletopia-icon">
						<use href="#tabletopia" />
					</svg>
					Tabletopia
				</a>` : '' }
				${ bgaUri ? `<a href="${bgaUri}" target="_blank" title="Available to play on Board Game Arena" class="game__bga">
					<svg xmlns="http://www.w3.org/2000/svg" class="game__bga-icon">
						<use href="#bga" />
					</svg>
					BGA
				</a>` : '' }
			</small>
			${ favourite ? `<svg xmlns="http://www.w3.org/2000/svg" class="game__favourite">
				<title>
					One of our favourites
				</title>
				<use href="#favourite" />
			</svg>` : '' }
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
				${ game.tabletopiaUri ? 'data-tabletopia' : '' }
			>
				${ renderGame(game) }
			</li>`, '') }
		</ul>
		<p class="games__no-matching-games">
			None of my board games matched your criteria!
		</p>
	</div>`;
}
