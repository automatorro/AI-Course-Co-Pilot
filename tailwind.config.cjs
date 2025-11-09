/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    { pattern: /^text-ink-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^bg-ink-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^border-ink-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^text-accent-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^bg-accent-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^border-accent-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^text-secondary-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^bg-secondary-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^border-secondary-(50|100|200|300|400|500|600|700|800|900)$/ },
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#eff6ff', '100': '#dbeafe', '200': '#bfdbfe',
          '300': '#93c5fd', '400': '#60a5fa', '500': '#3b82f6',
          '600': '#2563eb', '700': '#1d4ed8', '800': '#1e40af',
          '900': '#1e3a8a', '950': '#172554',
        },
        ink: {
          '50': '#f8fafc', '100': '#f1f5f9', '200': '#e2e8f0',
          '300': '#cbd5e1', '400': '#94a3b8', '500': '#64748b',
          '600': '#475569', '700': '#334155', '800': '#1e293b',
          '900': '#0f172a',
        },
        accent: {
          '50': '#f3fff3', '100': '#e3ffe3', '200': '#c4ffc4',
          '300': '#99f199', '400': '#5fe35f', '500': '#32CD32',
          '600': '#2eb82e', '700': '#238f23', '800': '#176f17',
          '900': '#125312',
        },
        secondary: {
          '50': '#f0fdfa', '100': '#ccfbf1', '200': '#99f6e4',
          '300': '#5eead4', '400': '#2dd4bf', '500': '#14b8a6',
          '600': '#0d9488', '700': '#0f766e', '800': '#115e59',
          '900': '#134e4a',
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "Arial", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        premium: '0 12px 40px rgba(16, 24, 40, 0.10), 0 2px 6px rgba(16, 24, 40, 0.06)'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
}