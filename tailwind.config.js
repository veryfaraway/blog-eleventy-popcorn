/** @type {import('tailwindcss').Config} */
const baseConfig = require('@veryfaraway/eleventy-theme/tailwind.config.base');

module.exports = {
  content: [
    "./src/**/*.{njk,md,html,js}",
    "./.eleventy.js",
    "./node_modules/@veryfaraway/eleventy-theme/theme/**/*.{njk,md,html,js}",
  ],
  theme: baseConfig.theme,
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
