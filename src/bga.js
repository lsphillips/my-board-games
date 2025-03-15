export function buildGameUri (id, language = 'en')
{
	return `https://${language}.boardgamearena.com/gamepanel?game=${id}`;
}
