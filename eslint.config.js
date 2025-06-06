import protectMeFromMyStupidity             from 'eslint-config-protect-me-from-my-stupidity';
import andFromWritingStupidNodeApplications from 'eslint-config-protect-me-from-my-stupidity/and/from-writing-stupid-node-applications';
import andFromWritingStupidWebApplications  from 'eslint-config-protect-me-from-my-stupidity/and/from-writing-stupid-web-applications';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default [
	{
		ignores : ['build/**/*']
	},
	...protectMeFromMyStupidity(),
	...andFromWritingStupidWebApplications([
		'src/scripts/**/*.js'
	]),
	...andFromWritingStupidNodeApplications([
		'src/*.js',
		'src/templates/**/*.js',
		'build.js'
	])
];
