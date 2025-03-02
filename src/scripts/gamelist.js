function isSupportingPlayerCount (game, criteria)
{
	if (criteria.players === 0)
	{
		return true;
	}

	return criteria.players >= parseInt(game.dataset.minPlayers, 10)
		&& criteria.players <= parseInt(game.dataset.maxPlayers, 10);
}

function isAccessible (game, criteria)
{
	return !criteria.onlyAccessible || game.hasAttribute('data-accessible');
}

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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export function setup ()
{
	const gameCounter      = document.querySelector('.games__game-count');
	const expansionCounter = document.querySelector('.games__expansion-count');
	const gameList         = document.querySelector('.games__collection');
	const summary          = document.querySelector('.games__summary');
	const emptyMessage     = document.querySelector('.games__no-matching-games');
	const games            = document.querySelectorAll('.games__item');

	window.addEventListener('query', ({
		detail
	}) =>
	{
		window.scrollTo(0, 0);

		if (!games.length)
		{
			return;
		}

		let gameCount = 0, expansionCount = 0;

		for (const game of games)
		{
			let playable = false;

			if (
				!isAccessible(game, detail)
			)
			{
				game.style.display = 'none';

				continue; // eslint-disable-line no-continue
			}

			const expansions = game.querySelectorAll('.game__expansion');

			if (expansions.length > 0)
			{
				let supportedCount = 0;

				for (const expansion of expansions)
				{
					const supported = isSupportingPlayerCount(expansion, detail) && isAccessible(expansion, detail);

					if (supported)
					{
						expansionCount++;
						supportedCount++;

						expansion.style.display = 'block';
					}
					else
					{
						expansion.style.display = 'none';
					}

					playable |= supported;
				}

				game.querySelector('.game__expansions').style.display = supportedCount === expansions.length ? 'block' : 'none';
			}

			playable |= isSupportingPlayerCount(game, detail);

			if (playable)
			{
				gameCount++;

				game.style.display = 'block';
			}
			else
			{
				game.style.display = 'none';
			}
		}

		gameCounter.textContent = renderCount(gameCount, 'game', 'games');
		expansionCounter.textContent = renderCount(expansionCount, 'expansion', 'expansions');

		if (gameCount)
		{
			gameList.style.display     = 'block';
			summary.style.display      = 'block';
			emptyMessage.style.display = 'none';
		}
		else
		{
			gameList.style.display     = 'none';
			summary.style.display      = 'none';
			emptyMessage.style.display = 'block';
		}
	});
}
