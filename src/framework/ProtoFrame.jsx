import { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

/**
 * ProtoFrame
 * Wraps a prototype with a full-bleed canvas. No visible chrome —
 * the prototype gets 100% of the viewport.
 *
 * A 24×24 invisible hover zone in the bottom-left corner reveals
 * a small home icon button to return to the index.
 */
export function ProtoFrame({ title, note, children }) {
  const [visible, setVisible] = useState(false)

  return (
    <Flex direction="column" minH="100vh" bg="bg">
      {/* Invisible hover zone — bottom-left corner */}
      <Box
        position="fixed"
        bottom="0"
        left="0"
        w="24px"
        h="24px"
        zIndex="9999"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      />

      {/* Floating home button */}
      <Link to="/">
        <Flex
          position="fixed"
          bottom="0"
          left="0"
          w="24px"
          h="24px"
          transform={visible ? 'translate(0, 0)' : 'translate(-100%, 100%)'}
          transition="transform 0.2s ease, opacity 0.2s ease"
          opacity={visible ? 1 : 0}
          zIndex="10000"
          align="center"
          justify="center"
          bg="fg"
          color="bg"
          borderTopRightRadius="2px"
          cursor="pointer"
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Flex>
      </Link>

      <Box as="main" flex="1">
        {children}
      </Box>
    </Flex>
  )
}
