/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './js/**/*.js'
  ],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  safelist: [
    'bg-red-600',
    'bg-blue-600',
    'bg-yellow-500',
    'bg-purple-600',
    'bg-red-700',
    'bg-green-600',
    'bg-green-800',
    'bg-cyan-600',
    'bg-orange-500',
    'bg-slate-500',
    'text-black',
    'selected-politician',
    'ring-blue-500',
    'dark:ring-blue-400',
    'active:bg-gray-100',
    'dark:active:bg-gray-800'
  ]
};