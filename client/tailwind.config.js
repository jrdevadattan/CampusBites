/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        // Brand orange palette inspired by provided assets
        "primary-200" : "#F15A24", // deep orange
        "primary-100" : "#FF7A45", // light orange for hovers
        // Optional complementary accents (unused mostly)
        "secondary-200" : "#1F2937",
        "secondary-100" : "#374151"
      }
    },
  },
  plugins: [],
}

