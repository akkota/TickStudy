/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#202225",
        secondary: "5865f2",
      },
      fontFamily: {
        nunito: ["Nunito"],
      },
      top: {
        47: "11.5rem",
      },
      height: {
        100: "26rem",
        110: "29rem",
        120: "32rem",
      },
      width: {
        68: "17rem",
      },
      keyframes: {
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        gradient: "gradient 6s linear infinite",
      },
    },
  },
  plugins: [],
};
