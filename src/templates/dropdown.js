export function renderDropdown (options, name, {
	label     = '',
	className = ''
} = {})
{
	return `<label class="dropdown ${className}">
		${ label ? `<span class="dropdown__label">
			${label}
		</span>` : '' }
		<select class="dropdown__field" name="${name}">
			${ options.reduce((acc, option) => acc + `<option value="${option.value}">
				${option.label}
			</option>`, '') }
		</select>
	</label>`;
}
