/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'trust-blue': {
          900: '#1e3a8a', // Deep Trust Blue
        },
        'alert-red': {
          600: '#dc2626', // High Risk
        },
        'warning-amber': {
          500: '#f59e0b', // Medium Risk
        },
        'safe-green': {
          600: '#16a34a', // Low Risk
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
