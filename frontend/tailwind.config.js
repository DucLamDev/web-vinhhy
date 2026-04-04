const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15304a",
        sand: "#fffaf2",
        ocean: "#0f8ea4",
        coral: "#ff7a1a",
        sun: "#ffd166",
        sky: "#e6f7fb",
        teal: "#2fb7c4"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(21, 48, 74, 0.12)"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top, rgba(255,255,255,0.85), transparent 24%), linear-gradient(140deg, rgba(230,247,251,0.95), rgba(255,250,242,0.92) 46%, rgba(255,255,255,0.98))"
      },
      borderRadius: {
        xl2: "1.5rem"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(18px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        }
      },
      animation: {
        float: "float 10s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-in": "slideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none"
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none"
        },
        ".glass-panel": {
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(16px) saturate(1.45)",
          WebkitBackdropFilter: "blur(16px) saturate(1.45)",
          border: "1px solid rgba(255,255,255,0.35)"
        }
      });
    })
  ]
};
