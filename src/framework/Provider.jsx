import { ChakraProvider } from '@chakra-ui/react'
import { themes } from './theme'

/**
 * Provider — wraps children with the correct Chakra theme.
 *
 * Props:
 *   theme: 'wireframe' | 'relaxed' (default: 'wireframe')
 */
export function Provider({ theme = 'wireframe', children }) {
  const system = themes[theme] || themes.wireframe
  return <ChakraProvider value={system}>{children}</ChakraProvider>
}
