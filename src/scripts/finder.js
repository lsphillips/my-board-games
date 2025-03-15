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
			accessible : form.get('accessible') !== null,
			quick      : form.get('quick') !== null,
			bga        : form.get('bga') !== null,
			players    : parseInt(
				form.get('players'), 10
			)
		};

		window.dispatchEvent(new CustomEvent('query', {
			detail, bubbles : true
		}));
	});
}
