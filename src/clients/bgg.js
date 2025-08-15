import {
	XMLParser
} from 'fast-xml-parser';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const cache = {};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function parseThingsResponse (xml)
{
	const {
		items
	} = new XMLParser({

		// Attributes are used heavily by the Board Game
		// Geeks API.
		ignoreAttributes : false,

		// Remove the default `@_` attribute prefix as it
		// makes it easier to code with.
		attributeNamePrefix : '',

		// Attribute values should be parsed.
		parseAttributeValue : true,

		// Ensures certain paths are always treated as
		// arrays.
		isArray : (_, jpath) => ['items.item', 'items.item.name'].includes(jpath)
	})
		.parse(xml);

	const games = [];

	for (const item of items.item)
	{
		const {
			id,
			thumbnail,
			minplayers,
			maxplayers
		} = item;

		const name = item.name.find(n => n.type === 'primary').value;

		games.push({
			id,
			name,
			thumbnail,
			players : {
				min : minplayers.value,
				max : maxplayers.value
			},
			uri : `https://boardgamegeek.com/boardgame/${id}`
		});
	}

	return games;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function getGamesAndExpansions (bggIds)
{
	if (!bggIds.length)
	{
		return [];
	}

	if (bggIds.length > 10)
	{
		const results = [];

		for (let i = 0, l = bggIds.length; i < l; i += 10)
		{
			const items = await getGamesAndExpansions(
				bggIds.slice(i, i + 10)
			);

			results.push(...items);
		}

		return results;
	}

	const query = `id=${ bggIds.join(',') }`;

	if (
		cache[query]
	)
	{
		return cache[query];
	}

	const response = await fetch(`https://boardgamegeek.com/xmlapi2/thing?${ query }`);

	if (response.status !== 200)
	{
		throw new Error(`Unable to fetch games and expansions from Board Game Geeks. The API responded with status code ${response.status}.`);
	}

	const result = cache[query] = parseThingsResponse( // eslint-disable-line require-atomic-updates
		await response.text()
	);

	return result;
}
