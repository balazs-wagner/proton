import { Box, Flex, Text } from '@chakra-ui/react'

/**
 * Placeholder — a generic grey box you can use for "something goes here".
 * Usage: <Placeholder label="hero image" h="200px" />
 */
export function Placeholder({ label, ...rest }) {
  return (
    <Flex
      align="center"
      justify="center"
      bg="bg.muted"
      borderWidth="1px"
      borderColor="border"
      borderStyle="dashed"
      color="fg.muted"
      fontSize="xs"
      minH="60px"
      {...rest}
    >
      {label && <Text>[{label}]</Text>}
    </Flex>
  )
}

/**
 * Frame — a bordered region to group related UI.
 * Usage: <Frame label="Settings panel"> ... </Frame>
 */
export function Frame({ label, children, ...rest }) {
  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      p={4}
      position="relative"
      {...rest}
    >
      {label && (
        <Text
          position="absolute"
          top="-8px"
          left="8px"
          px={1}
          bg="bg"
          fontSize="xs"
          color="fg.muted"
        >
          {label}
        </Text>
      )}
      {children}
    </Box>
  )
}

/**
 * Annotate — small margin note for design rationale, visible only in prototype.
 * Usage: <Annotate>User should hesitate here — intentional friction</Annotate>
 */
export function Annotate({ children }) {
  return (
    <Box
      borderLeftWidth="2px"
      borderColor="fg.muted"
      pl={2}
      py={1}
      my={2}
      fontSize="xs"
      color="fg.muted"
      fontStyle="italic"
    >
      {children}
    </Box>
  )
}
