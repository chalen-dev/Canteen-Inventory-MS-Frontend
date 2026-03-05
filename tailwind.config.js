/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#8b5cf6', // purple-500
                    hover: '#7c3aed',    // purple-600
                },
            },
        },
    },
    plugins: [],
}