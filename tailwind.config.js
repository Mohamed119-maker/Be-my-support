/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        "main-color": "#38BDF8",
        "sec-color": "#0E7490"
      },
      animation: {
        'fade-scale': 'fadeScale 0.4s ease-out',
      },
      keyframes: {
        fadeScale: {
          '0%': { opacity: 0, transform: 'scale(0.9)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    "flowbite/plugin"
  ],
}

