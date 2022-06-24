/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/routes/**/*.{html,svelte}'],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')]
};
