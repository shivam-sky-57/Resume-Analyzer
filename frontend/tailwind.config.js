/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#534AB7',
          tint: '#EEEDFE',
        },
        success: {
          DEFAULT: '#1D9E75',
          tint: '#E1F5EE',
        },
        warning: {
          DEFAULT: '#BA7517',
          tint: '#FAEEDA',
        },
        danger: {
          DEFAULT: '#993C1D',
          tint: '#FAECE7',
        },
        neutral: {
          slate: '#2C2C2A',
          bg: '#F1EFE8',
        },
        page: '#F8F8F7',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'input': '6px',
        'card': '10px',
        'modal': '16px',
      },
    },
  },
  plugins: [],
}
