/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
        dark: {
          900: "#0a0f1e",
          800: "#0d1427",
          700: "#111827",
          600: "#1f2937",
          500: "#374151",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      animation: {
        "fade-in":     "fadeIn 0.6s ease-out forwards",
        "slide-up":    "slideUp 0.6s ease-out forwards",
        "slide-right": "slideRight 0.5s ease-out forwards",
        "pulse-slow":  "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "gradient":    "gradient 8s ease infinite",
        "float":       "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:     { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:    { from: { opacity: 0, transform: "translateY(24px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        slideRight: { from: { opacity: 0, transform: "translateX(-24px)" }, to: { opacity: 1, transform: "translateX(0)" } },
        gradient:   { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        float:      { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-12px)" } },
      },
      backgroundSize: { "300%": "300%" },
      boxShadow: {
        glow:       "0 0 20px rgba(59,130,246,0.35)",
        "glow-lg":  "0 0 40px rgba(59,130,246,0.25)",
        card:       "0 4px 24px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
