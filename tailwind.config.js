export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0d6efd',
          50: '#e7f1ff',
          100: '#cfe3ff',
          200: '#9fc7ff',
          300: '#6fabe6',
          400: '#3f90ff',
          500: '#0d6efd',
          600: '#0a54c4',
          700: '#083a8b',
          800: '#052152',
          900: '#021719'
        },
        success: '#16a34a',
        warning: '#f59e0b',
        danger: '#dc2626'
      }
    }
  },
  plugins: []
};
