import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        roofing: {
          charcoal: "hsl(var(--roofing-charcoal))",
          navy: "hsl(var(--roofing-navy))",
          blue: "hsl(var(--roofing-blue))",
          steel: "hsl(var(--roofing-steel))",
          slate: "hsl(var(--roofing-slate))",
          success: "hsl(var(--roofing-success))",
          warning: "hsl(var(--roofing-warning))",
          emergency: "hsl(var(--roofing-emergency))",
        },
        conversion: {
          orange: "hsl(var(--conversion-orange))",
          gold: "hsl(var(--conversion-gold))",
        },
        charcoal: "hsl(var(--charcoal))",
        electric: {
          bright: "hsl(var(--electric-bright))",
          light: "hsl(var(--electric-light))",
          glow: "hsl(var(--electric-glow))",
        },
        steel: {
          light: "hsl(var(--steel-light))",
          dark: "hsl(var(--steel-dark))",
        },
        chrome: "hsl(var(--chrome))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "metallic-shimmer": {
          "0%": {
            backgroundPosition: "-200% center",
          },
          "100%": {
            backgroundPosition: "200% center",
          },
        },
        "electric-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px hsla(199, 100%, 55%, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 40px hsla(199, 100%, 55%, 0.8)",
          },
        },
      },
      animation: {
        shimmer: "shimmer 3s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "metallic-shimmer": "metallic-shimmer 8s ease-in-out infinite",
        "electric-pulse": "electric-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
