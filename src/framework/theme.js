import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

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
    },
    semanticTokens: {
      colors: {
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
      },
    },
  },
  globalCss: {
    body: {
      bg: 'bg',
      color: 'fg',
    },
    '*': {
      // flatten Chakra's default shadows for a true wireframe look
      boxShadow: 'none !important',
    },
  },
})

export const system = createSystem(defaultConfig, wireframeConfig)
