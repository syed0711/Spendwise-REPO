// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // If index.html moves to root of frontend for Vite
    "./public/index.html", // If index.html remains in public
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // MUI compatibility:
  // It's often recommended to disable Tailwind's preflight styles
  // if you're using MUI with CssBaseline to avoid conflicts.
  // CssBaseline already provides a good base.
  // corePlugins: {
  //  preflight: false,
  // }
};
