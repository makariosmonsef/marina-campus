/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F2F7F4',
          100: '#E1ECE5',
          200: '#C2D7CB',
          300: '#9FBFAe',
          400: '#5A826D', // Living Sage green
          500: '#2D5A43', // Heritage Deep Ivy (Primary brand)
          600: '#254A37',
          700: '#1D3B2C',
          800: '#152C21',
          900: '#0E1D16',
          DEFAULT: '#2D5A43',
          sage: '#5A826D',
        },
        coral: {
          50: '#FDF7F5',
          100: '#FAECE7',
          200: '#F4D5CC',
          300: '#EBB5A6',
          400: '#E2907A',
          500: '#D96B47', // Warm Baked Clay / Terracotta accent
          600: '#C45734',
          700: '#A34224',
          800: '#823219',
          900: '#632411',
          DEFAULT: '#D96B47',
        },
        gold: {
          50: '#FAF7F0',
          100: '#F4ECDC',
          200: '#EAD9B8',
          300: '#DFC28F',
          400: '#C5983D', // Warm Academy Ochre gold
          500: '#B0832F',
          600: '#8E6621',
          700: '#714F16', // High-contrast gold text
          800: '#54390C',
          900: '#382506',
          DEFAULT: '#C5983D',
        },
        forest: {
          50: '#F2F5F3',
          100: '#E2E8E4',
          200: '#C3CEC7',
          300: '#9EB0A5',
          400: '#6C8375',
          500: '#4A5B52', // Forest Slate (Secondary text)
          600: '#34433B',
          700: '#1C2822', // Deep Spruce Charcoal (Primary text)
          800: '#141D19',
          900: '#0C120F',
          DEFAULT: '#1C2822',
          muted: '#4A5B52', // Secondary text
        },
        surface: {
          DEFAULT: '#FAF7F2', // Warm Porcelain Ivory canvas
          canvas: '#FAF7F2',
          alt: '#F3EFE6',    // Soft Sand subtle surface
          muted: '#F3EFE6',
          card: '#FFFFFF',   // Crisp Pure White card
          border: '#E2DDD2', // Grounded Warm Sand border
          subtle: '#EAE4D9',
        },
        status: {
          success: '#26733E',
          'success-bg': '#EDF6F0',
          'success-border': '#BDDFC7',
          warning: '#B87014',
          'warning-bg': '#FAF2E6',
          'warning-border': '#ECCFA8',
          error: '#CC3D35',
          'error-bg': '#FDF1F0',
          'error-border': '#F5CBC7',
          info: '#2B6987',
          'info-bg': '#EEF5F8',
          'info-border': '#C6DCE8',
        }
      },
      boxShadow: {
        'warm-xs': '0 1px 2px rgba(28, 40, 34, 0.04)',
        'warm-sm': '0 1px 3px rgba(45, 90, 67, 0.05), 0 1px 2px rgba(28, 40, 34, 0.04)',
        'warm-md': '0 4px 12px -2px rgba(45, 90, 67, 0.07), 0 2px 6px -1px rgba(28, 40, 34, 0.04)',
        'warm-lg': '0 10px 24px -4px rgba(45, 90, 67, 0.09), 0 4px 10px -2px rgba(28, 40, 34, 0.04)',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
