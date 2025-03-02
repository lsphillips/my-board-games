export function renderFooter ({
	className = ''
} = {})
{
	return `<footer class="footer ${className}">
		<p class="footer__disclaimer">
			Game information provided by <a href="https://boardgamegeek.com/wiki/page/BGG_XML_API2" target="_blank" class="footer__link">Board Game Geek</a>
		</p>
	</footer>`;
}
