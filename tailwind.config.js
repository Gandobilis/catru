/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                mtavruli: ['mtavruli', 'sans-serif'],
                mrglovani: ['mrglovani', 'sans-serif'],
            },
        },
        colors: {
            'primary-blue': '#1C5285',
            'stroke-grey': '#D0D5DD',
            'primary-button-hover': '#A39161',
            'secondary-button-default': '#ED1C24',
            'secondary-button-hover': '#BF161D',
            'placeholder-grey': '#98A2B3',
            'custom-green': '#117554',
            'white': '#FFFFFF',
            'disabled': '#EAEAEA'
        },
    },
    plugins: [
        require('daisyui'),
    ],
}
