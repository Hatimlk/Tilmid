/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0095ff',
        secondary: '#00d2ff',
        royal: '#040fd9',
        dark: '#1f2937',
        light: '#f3f4f6'
      },
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
      },
      lineHeight: {
        'relaxed': '1.8',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'bounce-slow': 'bounce 3s infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'ripple': 'ripple 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'scroll-rtl': 'scroll 40s linear infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(0, 149, 255, 0.4))' },
          '50%': { filter: 'drop-shadow(0 0 20px rgba(0, 149, 255, 0.8))' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      }
    }
  },
  plugins: [],
}
