/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nino: ['nino', 'sans-serif'],  // Adding your custom font 'Nino'
        bpg: ['bpg', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}
