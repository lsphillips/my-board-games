import {
	readFile
} from 'node:fs/promises';
import {
	load
} from 'js-yaml';
import * as bgg from './clients/bgg.js';
import * as bga from './clients/bga.js';
import * as tabletopia from './clients/tabletopia.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

async function loadBggMetadata (games)
{
	const bggIds = games.flatMap(game =>
	{
		return game.expansions ? [game.bggId, game.expansions.map(expansion => expansion.bggId)] : game.bggId;
	});

	const gamesAndExpansions = await bgg.getGamesAndExpansions(bggIds);

	return new Map(
		gamesAndExpansions.map(game => [game.id, game])
	);
}

function getEmbellishedExpansion ({
	bggId,
	name,
	location = null
}, game, locations, bggMetadata)
{
	if (
		location && !locations[location]
	)
	{
		throw new Error(`Game expansion "${name}" is in an unknown location.`);
	}

	const metadata = bggMetadata.get(bggId);

	if (!metadata)
	{
		throw new Error(`BGG metadata for game expansion "${name}" could not be found. Please ensure the correct BGG ID is configured.`);
	}

	const expansion = {
		...metadata, name
	};

	// Location.
	expansion.location   = locations[location]?.name ?? 'In Game Box';
	expansion.accessible = locations[location]?.accessible || (!location && game.accessible);

	return expansion;
}

function getEmbellishedGame ({
	bggId,
	name,
	bgaId = null,
	tabletopiaId = null,
	location = null,
	favourite = false,
	expansions = [],
	quick = false
}, locations, bggMetadata)
{
	if (
		!locations[location]
	)
	{
		throw new Error(`Game "${name}" is in an unknown location.`);
	}

	const metadata = bggMetadata.get(bggId);

	if (!metadata)
	{
		throw new Error(`BGG metadata for game "${name}" could not be found. Please ensure the correct BGG ID is configured.`);
	}

	const game = {
		...metadata, name, favourite, quick
	};

	// Board Game Arena.
	game.bgaUri = bgaId ? bga.buildGameUri(bgaId) : null;

	// Tabletopia.
	game.tabletopiaUri = tabletopiaId ? tabletopia.buildGameUri(tabletopiaId) : null;

	// Location.
	game.location   = locations[location].name;
	game.accessible = locations[location].accessible;

	// Expansions.
	game.expansions = expansions.map(expansion => getEmbellishedExpansion(expansion, game, locations, bggMetadata));

	return game;
}

function getGamelistStatistics (games)
{
	let gameCount      = games.length,
		expansionCount = 0,
		minPlayers     = 1,
		maxPlayers     = 1;

	for (const { players, expansions = [] } of games)
	{
		minPlayers = Math.min(players.min, minPlayers);
		maxPlayers = Math.max(players.max, maxPlayers);

		for (const expansion of expansions)
		{
			minPlayers = Math.min(expansion.players.min, minPlayers);
			maxPlayers = Math.max(expansion.players.max, maxPlayers);
		}

		expansionCount += expansions.length;
	}

	return {
		gameCount,
		expansionCount,
		minPlayers,
		maxPlayers
	};
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function readGamelist (pathToGamelist)
{
	const gamelist = load(
		await readFile(pathToGamelist, 'utf8')
	);

	const metadata = await loadBggMetadata(gamelist.games);

	const games = gamelist.games
		.map(
			game => getEmbellishedGame(game, gamelist.locations, metadata)
		)
		.sort((a, b) => a.name.localeCompare(b.name));

	return {
		games, stats : getGamelistStatistics(games)
	};
}
