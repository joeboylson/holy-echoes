// Centralized theme configuration for easy editing
// All theme colors and font sizes are defined here in one place

// Font size configurations
export const fontSizes = {
  small: {
    base: "text-sm", // 14px
    lg: "text-base", // 16px
    xl: "text-lg", // 18px
    "2xl": "text-xl", // 20px
  },
  medium: {
    base: "text-base", // 16px (default)
    lg: "text-lg", // 18px
    xl: "text-xl", // 20px
    "2xl": "text-2xl", // 24px
  },
  large: {
    base: "text-lg", // 18px
    lg: "text-xl", // 20px
    xl: "text-2xl", // 24px
    "2xl": "text-3xl", // 30px
  },
} as const;

export const theme = {
  light: {
    // Headers & Accents
    header: "#0082cb",
    accent: "#0082cb",

    // Backgrounds
    background: "white",
    card: "white",

    // Text
    text: "text-gray-900",
    textMuted: "text-gray-500",
    textSubtle: "text-gray-600",

    // Borders
    border: "border-gray-200",

    // Interactive
    hover: "hover:text-gray-900",
  },

  dark: {
    // Headers & Accents
    header: "oklch(0.32_0.12_240)",
    accent: "oklch(0.5_0.12_240)",

    // Backgrounds
    background: "oklch(0.18_0_0)",
    card: "oklch(0.22_0_0)",

    // Text
    text: "dark:text-white",
    textMuted: "dark:text-gray-400",
    textSubtle: "dark:text-gray-200",

    // Borders
    border: "dark:border-[oklch(0.3_0_0)]",

    // Interactive
    hover: "dark:hover:text-white",
  },

  sepia: {
    // Headers & Accents
    header: "oklch(0.35_0.03_65)",
    accent: "oklch(0.35_0.03_65)",

    // Backgrounds
    background: "oklch(0.93_0.02_85)",
    card: "oklch(0.95_0.015_80)",

    // Text
    text: "sepia:text-[oklch(0.25_0.02_60)]",
    textMuted: "sepia:text-[oklch(0.5_0.02_65)]",
    textSubtle: "sepia:text-[oklch(0.5_0.02_65)]",

    // Borders
    border: "sepia:border-[oklch(0.82_0.02_75)]",

    // Interactive
    hover: "sepia:hover:text-[oklch(0.2_0.02_60)]",
  },
} as const;

// Helper functions to generate combined theme classes
export const themeClasses = {
  // Headers
  header: `bg-[${theme.light.header}] dark:bg-[${theme.dark.header}] sepia:bg-[${theme.sepia.header}]`,

  // Cards
  card: `bg-white dark:bg-[${theme.dark.card}] sepia:bg-[${theme.sepia.card}]`,
  cardBorder: `${theme.light.border} ${theme.dark.border} ${theme.sepia.border}`,

  // Text
  text: `${theme.light.text} ${theme.dark.text} ${theme.sepia.text}`,
  textMuted: `${theme.light.textMuted} ${theme.dark.textMuted} ${theme.sepia.textMuted}`,
  textSubtle: `${theme.light.textSubtle} ${theme.dark.textSubtle} ${theme.sepia.textSubtle}`,

  // Interactive text
  textInteractive: `${theme.light.textSubtle} ${theme.dark.textSubtle} ${theme.sepia.textSubtle} ${theme.light.hover} ${theme.dark.hover} ${theme.sepia.hover} hover:font-bold`,

  // Bottom nav active
  navActive: `text-[${theme.light.accent}] dark:text-[${theme.dark.accent}] sepia:text-[${theme.sepia.accent}]`,
  navInactive: `${theme.light.textMuted} ${theme.dark.textMuted} ${theme.sepia.textMuted}`,

  // Bottom nav background
  bottomNav: `bg-white dark:bg-[${theme.dark.card}] sepia:bg-[${theme.sepia.card}]`,
};
