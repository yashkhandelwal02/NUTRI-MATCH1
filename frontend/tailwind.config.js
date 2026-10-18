/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep obsidian background & surfaces
        obsidian: '#0A090F',
        dark: {
          900: '#0A090F',
          800: '#12111A',
          700: '#1A1826',
          600: '#252336',
        },
        // Cyber-organic vibrant palette
        lime: {
          DEFAULT: '#00FF87',
          neon: '#00FF87',
          dim: '#00CC6A',
          glow: 'rgba(0, 255, 135, 0.4)',
        },
        cyber: {
          purple: '#8A2BE2',
          violet: '#9D4EDD',
          glow: 'rgba(138, 43, 226, 0.4)',
        },
        tangerine: {
          DEFAULT: '#FF6B00',
          glow: 'rgba(255, 107, 0, 0.4)',
        },
        coral: {
          DEFAULT: '#FF4D6D',
          glow: 'rgba(255, 77, 109, 0.4)',
        },
        // Typography & surfaces
        silk: '#FBFBFE',
        cream: '#FFF3E3',
        ink: '#0A090F',
        turmeric: '#FFB347',
        pistachio: '#00FF87',
        muted: '#8E8E9F',
      },
      fontFamily: {
        display: ['Space Grotesk', 'Fraunces', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-lime': '0 0 30px -5px rgba(0, 255, 135, 0.35)',
        'glow-purple': '0 0 35px -5px rgba(138, 43, 226, 0.35)',
        'glow-orange': '0 0 30px -5px rgba(255, 107, 0, 0.35)',
        'glass': '0 20px 50px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
};
