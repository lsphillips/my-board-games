import {
	readFile
} from 'node:fs/promises';
import {
	load
} from 'js-yaml';
import * as bgg from './bgg.js';
import * as bga from './bga.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

async function createGameLookup (games)
{
	const things = await bgg.getThings(games.flatMap(game =>
	{
		return game.expansions ? [game.bggId, game.expansions.map(expansion => expansion.bggId)] : game.bggId;
	}));

	return new Map(
		things.map(thing => [thing.id, thing])
	);
}

function embellishExpansion ({
	bggId,
	name,
	location = null
}, game, locations, lookup)
{
	if (
		location && !locations[location]
	)
	{
		throw new Error(`Game expansion ${name} is in an unknown location.`);
	}

	const metadata = lookup.get(bggId);

	if (!metadata)
	{
		throw new Error(`Metadata for game expansion ${name} could not be found. Please ensure the correct BGG ID is configured.`);
	}

	const expansion = {
		...metadata, name
	};

	// Location.
	expansion.location   = locations[location]?.name ?? 'In Game Box';
	expansion.accessible = locations[location]?.accessible || (!location && game.accessible);

	return expansion;
}

function embellishGame ({
	bggId,
	name,
	bgaId = null,
	location = null,
	favourite = false,
	expansions = [],
	quick = false
}, locations, lookup)
{
	if (
		!locations[location]
	)
	{
		throw new Error(`Game ${name} is in an unknown location.`);
	}

	const metadata = lookup.get(bggId);

	if (!metadata)
	{
		throw new Error(`Metadata for game ${name} could not be found. Please ensure the correct BGG ID is configured.`);
	}

	const game = {
		...metadata, name, favourite, quick
	};

	// BGA.
	game.bgaUri = bgaId ? bga.buildGameUri(bgaId) : null;

	// Location.
	game.location   = locations[location].name;
	game.accessible = locations[location].accessible;

	// Expansions.
	game.expansions = expansions.map(expansion => embellishExpansion(expansion, game, locations, lookup));

	return game;
}

function getCollectionStats (games)
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

export async function collect (gamelist)
{
	const collection = load(
		await readFile(gamelist, 'utf8')
	);

	const lookup = await createGameLookup(collection.games);

	const games = collection.games
		.map(
			game => embellishGame(game, collection.locations, lookup)
		)
		.sort((a, b) => a.name.localeCompare(b.name));

	return {
		games, stats : getCollectionStats(games)
	};
}
