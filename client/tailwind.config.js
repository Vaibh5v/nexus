/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          text: '#172B3A',
          muted: '#64748B',
          border: '#E2E8F0',
          blue: '#155E8A',
          blueHover: '#10496C',
          accent: '#2B7A9B',
          success: '#16845B',
          successBg: '#ECFDF5',
        }
      }
    },
  },
  plugins: [],
}
