import { Box, Heading, Stack, Text, Flex } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { prototypes } from './prototypes/registry'

export function IndexPage() {
  return (
    <Flex justify="center" py={16} px={4} minH="100vh" bg="bg">
      <Box w="full" maxW="640px">
        <Stack gap={2} mb={8}>
          <Heading size="md">Prototypes</Heading>
          <Text fontSize="xs" color="fg.muted">
            Low-fidelity design explorations. Click any to open.
          </Text>
        </Stack>

        <Stack gap={0} borderTopWidth="1px" borderColor="border">
          {prototypes.map((p) => (
            <Link key={p.slug} to={`/${p.slug}`}>
              <Box
                py={3}
                px={2}
                borderBottomWidth="1px"
                borderColor="border"
                _hover={{ bg: 'bg.subtle' }}
              >
                <Text fontSize="sm" fontWeight="bold">
                  {p.title}
                </Text>
                <Text fontSize="xs" color="fg.muted">
                  {p.description}
                </Text>
              </Box>
            </Link>
          ))}
          {prototypes.length === 0 && (
            <Text fontSize="xs" color="fg.muted" py={4}>
              No prototypes yet. Add one in src/prototypes/registry.js
            </Text>
          )}
        </Stack>
      </Box>
    </Flex>
  )
}
