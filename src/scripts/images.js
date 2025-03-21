function show (image)
{
	image.classList.add('loaded');
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export function setup ()
{
	document.addEventListener('load', event =>
	{
		if (event.target.tagName.toLowerCase() === 'img')
		{
			show(event.target);
		}

	}, true);

	for (const image of document.images)
	{
		if (image.complete)
		{
			show(image);
		}
	}
}
