/**
 * Centralized Design System
 * Consistent styling patterns and utilities for components
 */

// Typography Scale
export const typography = {
  // Display text
  display: {
    lg: "text-4xl md:text-5xl lg:text-6xl font-bold",
    md: "text-3xl md:text-4xl lg:text-5xl font-bold",
    sm: "text-2xl md:text-3xl lg:text-4xl font-bold",
  },

  // Headings
  heading: {
    h1: "text-2xl md:text-3xl font-bold",
    h2: "text-xl md:text-2xl font-semibold",
    h3: "text-lg md:text-xl font-semibold",
    h4: "text-base md:text-lg font-semibold",
    h5: "text-sm md:text-base font-semibold",
    h6: "text-xs md:text-sm font-semibold",
  },

  // Body text
  body: {
    lg: "text-lg leading-relaxed",
    md: "text-base leading-relaxed",
    sm: "text-sm leading-relaxed",
    xs: "text-xs leading-relaxed",
  },

  // Labels and UI text
  label: {
    lg: "text-sm font-medium",
    md: "text-xs font-medium",
    sm: "text-xs font-medium uppercase tracking-wide",
  },

  // Code and monospace
  code: {
    inline:
      "text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded",
    block:
      "text-sm font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto",
  },
} as const;

// Spacing Scale
export const spacing = {
  // Consistent spacing values
  none: "0",
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "2rem", // 32px
  "4xl": "2.5rem", // 40px
  "5xl": "3rem", // 48px
  "6xl": "4rem", // 64px
} as const;

// Component spacing patterns
export const componentSpacing = {
  // Cards
  card: {
    padding: "p-4 md:p-6",
    gap: "space-y-3 md:space-y-4",
    margin: "mb-4 md:mb-6",
  },

  // Forms
  form: {
    fieldGap: "space-y-4 md:space-y-6",
    labelGap: "space-y-1 md:space-y-2",
    buttonGap: "space-x-2 md:space-x-3",
  },

  // Lists
  list: {
    itemGap: "space-y-2 md:space-y-3",
    sectionGap: "space-y-6 md:space-y-8",
  },

  // Layout
  layout: {
    section: "py-8 md:py-12 lg:py-16",
    container: "px-4 md:px-6 lg:px-8",
    maxWidth: "max-w-7xl mx-auto",
  },

  // Grid layouts
  grid: {
    responsive:
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6",
    cardGrid:
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 auto-rows-fr",
    cardGridMobile: "grid grid-cols-1 gap-3 sm:hidden", // Mobile-only single column
    cardGridTablet:
      "hidden sm:grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-fr", // Tablet and up
    listGrid: "grid grid-cols-1 gap-2 md:gap-3",
  },
} as const;

// Button Variants and Sizes
export const buttons = {
  // Base button classes
  base: "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",

  // Size variants
  sizes: {
    xs: "px-2 py-1 text-xs gap-1",
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
    xl: "px-8 py-4 text-lg gap-3",
  },

  // Style variants
  variants: {
    primary:
      "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    outline:
      "border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 focus:ring-purple-500",
    ghost:
      "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    warning:
      "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500",
  },
} as const;

// Card Variants
export const cards = {
  base: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200",

  // Size variants
  sizes: {
    sm: "p-3 md:p-4",
    md: "p-4 md:p-6",
    lg: "p-6 md:p-8",
  },

  // Interactive states
  interactive:
    "hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer",
  selected: "ring-2 ring-purple-500 border-purple-300 dark:border-purple-600",

  // Shadows
  shadows: {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  },
} as const;

// Input/Form Control Variants
export const inputs = {
  base: "block w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed",

  sizes: {
    sm: "px-3 py-1.5 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  },

  variants: {
    default:
      "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500",
    error:
      "bg-white dark:bg-gray-800 border-red-300 dark:border-red-700 text-gray-900 dark:text-gray-100 focus:ring-red-500",
    success:
      "bg-white dark:bg-gray-800 border-green-300 dark:border-green-700 text-gray-900 dark:text-gray-100 focus:ring-green-500",
  },
} as const;

// Color System
export const colors = {
  // Theme colors
  primary: {
    50: "bg-purple-50 text-purple-50",
    100: "bg-purple-100 text-purple-100",
    200: "bg-purple-200 text-purple-200",
    300: "bg-purple-300 text-purple-300",
    400: "bg-purple-400 text-purple-400",
    500: "bg-purple-500 text-purple-500",
    600: "bg-purple-600 text-purple-600",
    700: "bg-purple-700 text-purple-700",
    800: "bg-purple-800 text-purple-800",
    900: "bg-purple-900 text-purple-900",
  },

  // Semantic colors
  semantic: {
    success: "text-green-600 bg-green-600",
    warning: "text-yellow-600 bg-yellow-600",
    error: "text-red-600 bg-red-600",
    info: "text-blue-600 bg-blue-600",
  },

  // Text colors
  text: {
    primary: "text-gray-900 dark:text-gray-100",
    secondary: "text-gray-600 dark:text-gray-400",
    muted: "text-gray-500 dark:text-gray-500",
    inverse: "text-white dark:text-gray-900",
  },

  // Background colors
  background: {
    primary: "bg-white dark:bg-gray-900",
    secondary: "bg-gray-50 dark:bg-gray-800",
    muted: "bg-gray-100 dark:bg-gray-700",
  },
} as const;

// Animation and Transitions
export const animations = {
  transition: {
    fast: "transition-all duration-150 ease-in-out",
    normal: "transition-all duration-200 ease-in-out",
    slow: "transition-all duration-300 ease-in-out",
  },

  fade: {
    in: "animate-in fade-in duration-200",
    out: "animate-out fade-out duration-200",
  },

  slide: {
    in: "animate-in slide-in-from-bottom-2 duration-200",
    out: "animate-out slide-out-to-bottom-2 duration-200",
  },

  loading: "animate-spin",
  pulse: "animate-pulse",
} as const;

// Breakpoints (for reference in responsive design)
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Focus and Accessibility
export const focus = {
  ring: "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
  ringInset:
    "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500",
  visible:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
} as const;

// Utility functions for combining classes
export const combineClasses = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

// Helper to create component class builders
export const createClassBuilder = <T extends Record<string, any>>(
  baseClasses: string,
  variants: T,
) => {
  return (variantKey?: keyof T, additionalClasses?: string) => {
    const variantClasses = variantKey ? variants[variantKey] : "";
    return combineClasses(baseClasses, variantClasses, additionalClasses);
  };
};

// Common utility classes for consistency
export const utils = {
  // Text utilities
  text: {
    clamp1: "line-clamp-1",
    clamp2: "line-clamp-2",
    clamp3: "line-clamp-3",
    clamp4: "line-clamp-4",
    truncate: "truncate",
    wrap: "break-words",
    nowrap: "whitespace-nowrap",
  },

  // Layout utilities
  layout: {
    center: "flex items-center justify-center",
    centerY: "flex items-center",
    centerX: "flex justify-center",
    between: "flex items-center justify-between",
    stack: "flex flex-col",
    inline: "flex items-center",
    fullHeight: "min-h-screen",
    fullWidth: "w-full",
  },

  // Position utilities
  position: {
    absolute: "absolute",
    relative: "relative",
    fixed: "fixed",
    sticky: "sticky",
    inset: "inset-0",
    topRight: "absolute top-0 right-0",
    topLeft: "absolute top-0 left-0",
    bottomRight: "absolute bottom-0 right-0",
    bottomLeft: "absolute bottom-0 left-0",
  },

  // Visibility utilities
  visibility: {
    show: "block",
    hide: "hidden",
    invisible: "invisible",
    srOnly: "sr-only",
    notSrOnly: "not-sr-only",
  },

  // Interactive utilities
  interactive: {
    disabled: "opacity-50 cursor-not-allowed pointer-events-none",
    loading: "opacity-75 cursor-wait",
    clickable: "cursor-pointer",
    hoverable: "hover:opacity-80 transition-opacity",
  },

  // Responsive utilities
  responsive: {
    // Visibility by breakpoint
    showMobile: "block sm:hidden",
    hideMobile: "hidden sm:block",
    showTablet: "hidden sm:block md:hidden",
    showDesktop: "hidden md:block",

    // Mobile-first padding and margins
    paddingMobile: "p-3 sm:p-4 md:p-6",
    paddingXMobile: "px-3 sm:px-4 md:px-6",
    paddingYMobile: "py-3 sm:py-4 md:py-6",
    marginMobile: "m-3 sm:m-4 md:m-6",

    // Touch-friendly sizing
    touchTarget: "min-h-[44px] min-w-[44px]", // iOS/Android accessibility guidelines

    // Mobile container
    containerMobile: "px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto",
  },
} as const;
