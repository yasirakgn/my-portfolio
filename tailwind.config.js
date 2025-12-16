/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Soft Matte Backgrounds
        matte: {
          dark: '#18181b', // Zinc-950 (Main BG)
          card: '#27272a', // Zinc-800 (Card BG)
          border: '#3f3f46', // Zinc-700 (Border)
        },
        // Glass Tokens
        glass: {
          surface: 'rgba(24, 24, 27, 0.6)',
          border: 'rgba(255, 255, 255, 0.08)',
          highlight: 'rgba(255, 255, 255, 0.05)',
        },
        // Pastel Accents
        pastel: {
          blue: '#93c5fd',   // Blue-300
          purple: '#c4b5fd', // Violet-300
          green: '#86efac',  // Green-300
          yellow: '#fde047', // Yellow-300
          red: '#fca5a5',    // Red-300
        },
        primary: {
          DEFAULT: '#60a5fa', // Blue-400 (Softer than Blue-500)
          hover: '#3b82f6',   // Blue-500
        },
        accent: {
          DEFAULT: '#a78bfa', // Violet-400
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      fontSize: {
        'fluid-h1': 'clamp(2rem, 3.5vw, 3rem)',         // Dense Header
        'fluid-h2': 'clamp(1.5rem, 2vw, 2rem)',         // Tool Subheader
        'fluid-body': 'clamp(0.9rem, 1vw, 1rem)',       // Stays compact (14px max)
      },
      spacing: {
        'clamp-section': 'clamp(2rem, 4vh, 3.5rem)',    // Tighter Vertical Repose
        'clamp-gap': 'clamp(1rem, 1.5vw, 1.25rem)',     // High Density Grid
        'clamp-card': 'clamp(0.75rem, 1vw, 1.25rem)',   // Compact Cards
        'clamp-header': 'clamp(3rem, 6vh, 5rem)',       // Fixed feel header margin
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      maxWidth: {
        '8xl': '88rem', // 1408px
        '9xl': '96rem', // 1536px (matches 2xl screen)
        'ultrawide': '120rem', // 1920px
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
