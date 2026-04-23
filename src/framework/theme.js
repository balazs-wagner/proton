import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

/* ── Shared tokens ── */

const sharedTokens = {
  colors: {
    wire: {
      50: { value: '#fafafa' },
      100: { value: '#f4f4f4' },
      200: { value: '#e5e5e5' },
      300: { value: '#d4d4d4' },
      400: { value: '#a3a3a3' },
      500: { value: '#737373' },
      600: { value: '#525252' },
      700: { value: '#404040' },
      800: { value: '#262626' },
      900: { value: '#171717' },
    },
  },
  radii: {
    none: { value: '0' },
    sm: { value: '2px' },
    md: { value: '2px' },
    lg: { value: '2px' },
  },
}

const sharedSemanticColors = {
  bg: {
    DEFAULT: { value: '{colors.wire.50}' },
    subtle: { value: '{colors.wire.100}' },
    muted: { value: '{colors.wire.200}' },
  },
  fg: {
    DEFAULT: { value: '{colors.wire.900}' },
    muted: { value: '{colors.wire.500}' },
    subtle: { value: '{colors.wire.400}' },
  },
  border: {
    DEFAULT: { value: '{colors.wire.300}' },
    strong: { value: '{colors.wire.900}' },
  },
}

const sharedGlobalCss = {
  body: { bg: 'bg', color: 'fg' },
  '*': { boxShadow: 'none !important' },
}

/* ── Wireframe (default) ── */

/**
 * Wireframe theme — intentionally low-fi.
 * - Grayscale only
 * - Mono font to signal "not final"
 * - Flat borders, no shadows, no radius
 * - Keeps focus on structure and interaction
 */
const wireframeConfig = defineConfig({
  theme: {
    tokens: {
      fonts: {
        body: { value: '"JetBrains Mono", ui-monospace, Menlo, monospace' },
        heading: { value: '"JetBrains Mono", ui-monospace, Menlo, monospace' },
      },
      ...sharedTokens,
    },
    semanticTokens: { colors: sharedSemanticColors },
  },
  globalCss: sharedGlobalCss,
})

/* ── Relaxed ── */

/**
 * Relaxed theme — same grayscale wireframe but with
 * more breathing room and slightly larger type.
 * Good for presenting to stakeholders or usability testing.
 */
const relaxedConfig = defineConfig({
  theme: {
    tokens: {
      fonts: {
        body: { value: '"JetBrains Mono", ui-monospace, Menlo, monospace' },
        heading: { value: '"JetBrains Mono", ui-monospace, Menlo, monospace' },
      },
      fontSizes: {
        xs: { value: '0.85rem' },
        sm: { value: '0.95rem' },
        md: { value: '1.05rem' },
        lg: { value: '1.2rem' },
        xl: { value: '1.35rem' },
      },
      spacing: {
        1: { value: '0.35rem' },
        2: { value: '0.65rem' },
        3: { value: '1rem' },
        4: { value: '1.35rem' },
        5: { value: '1.7rem' },
        6: { value: '2.1rem' },
        8: { value: '2.8rem' },
        10: { value: '3.5rem' },
        16: { value: '5.5rem' },
      },
      ...sharedTokens,
    },
    semanticTokens: { colors: sharedSemanticColors },
  },
  globalCss: sharedGlobalCss,
})

/* ── Systems ── */

export const themes = {
  wireframe: createSystem(defaultConfig, wireframeConfig),
  relaxed: createSystem(defaultConfig, relaxedConfig),
}

// Default export for backward compat
export const system = themes.wireframe
