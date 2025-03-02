export function setup ()
{
	const finder = document.querySelector('.finder');

	document.querySelector('.header__find').addEventListener('click', () =>
	{
		finder.showModal();
	});

	document.querySelector('.finder__close').addEventListener('click', () =>
	{
		finder.close();
	});

	document.querySelector('.finder__form').addEventListener('submit', ({
		target
	}) =>
	{
		const form = new FormData(target);

		const detail = {
			players : parseInt(
				form.get('players'), 10
			),
			onlyAccessible : form.get('accessible-only') !== null
		};

		window.dispatchEvent(new CustomEvent('query', {
			detail, bubbles : true
		}));
	});
}
