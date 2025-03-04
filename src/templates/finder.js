import {
	renderSelect
} from './select.js';
import {
	renderCheckbox
} from './checkbox.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export function renderFinder (stats, {
	className = ''
} = {})
{
	let options = [{
		value : 0, label : 'Any number'
	}];

	for (let i = stats.minPlayers; i <= stats.maxPlayers; i++)
	{
		options.push({
			value : i, label : i
		});
	}

	return `<dialog class="finder ${className}">
		<h2 class="finder__title">
			Find Board Games
		</h2>
		<button class="finder__close">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" class="finder__close-icon">
				<title>
					Close
				</title>
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="6.8" d="M3.429 44.571 44.57 3.43m0 41.142L3.43 3.43" />
			</svg>
		</button>
		<form method="dialog" class="finder__form">
			<div class="finder__criteria">
				${ renderSelect(options, 'players', {
					label     : 'Number of players',
					className : 'finder__players'
				}) }
				${ renderCheckbox('accessible', {
					label     : 'Easy to reach only',
					className : 'finder__accessible'
				}) }
				${ renderCheckbox('quick', {
					label     : 'Quick to play only',
					className : 'finder__quick'
				}) }
			</div>
			<div class="finder__actions">
				<button class="finder__submit">
					Search
				</button>
			</div>
		</form>
	</dialog>`;
}
