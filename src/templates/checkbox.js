export function renderCheckbox (name, {
	label     = '',
	className = ''
} = {})
{
	return `<label class="checkbox ${className}">
		<span class="checkbox__label">
			${label}
		</span>
		<input type="checkbox" name="${name}" class="checkbox__input" />
	</label>`;
}
