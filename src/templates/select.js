export function renderSelect (options, name, {
	label     = '',
	className = ''
} = {})
{
	return `<label class="select ${className}">
		${ label ? `<span class="select__label">
			${label}
		</span>` : '' }
		<select class="select__input" name="${name}">
			${ options.reduce((acc, option) => acc + `<option value="${option.value}">
				${option.label}
			</option>`, '') }
		</select>
	</label>`;
}
