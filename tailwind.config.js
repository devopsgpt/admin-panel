/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,ts,tsx,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "vignette-radial": "radial-gradient(50% 50% at 80%, #320D37 0%, #0D0316 80%)",
      },
      fontFamily: {
        figtree: ['figtree', 'sans-serif']
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        orange: {
          base: "#f86609"
        },
        "black-1": "#121212"
      }
    }
  },
  daisyui: {
    themes: ["light", "dark"],
  },
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [require("tailwind-scrollbar"), require('daisyui')],
}

