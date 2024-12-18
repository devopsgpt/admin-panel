/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,tsx,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "vignette-radial": "radial-gradient(50% 50% at 80%, #320D37 0%, #0D0316 80%)",
        "linear": "linear-gradient(90deg, #0d0316 0%, #b230ca 50%, #0d0316 100%)"
      },
      fontFamily: {
        figtree: ['figtree']
      },
      colors: {
        "black-1": "#121212",
        orchid: {
          "light": "#d180e0",
          medium: "#b230ca",
        }
      }
    }
  },
  corePlugins: {
    preflight: true,
  },

  plugins: [require("tailwind-scrollbar"), require('daisyui')],
}

