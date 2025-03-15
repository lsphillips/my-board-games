function renderLastUpdated (timestamp)
{
	const date = new Date(timestamp);

	return `<time datetime="${ date.toISOString() }">
		${ new Intl.DateTimeFormat('en-GB', {
			hourCycle : 'h24',
			dateStyle : 'short',
			timeStyle : 'short',
			timeZone  : 'UTC'
		}).format(date) }
	</time>`;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export function renderFooter ({
	timestamp,
	className = ''
} = {})
{
	return `<footer class="footer ${className}">
		<p class="footer__disclaimer">
			Game information provided by <a href="https://boardgamegeek.com/wiki/page/BGG_XML_API2" target="_blank" class="footer__link">Board Game Geek</a>
		</p>
		<p class="footer__last-updated">
			Last updated at ${ renderLastUpdated(timestamp) }
		</p>
	</footer>`;
}
