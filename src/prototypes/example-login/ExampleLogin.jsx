import { useState } from 'react'
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  Heading,
  Flex,
} from '@chakra-ui/react'
import { ProtoFrame, Frame, Annotate } from '../../framework'

/**
 * Example prototype — copy this folder structure to start a new one:
 *   src/prototypes/<slug>/<ComponentName>.jsx
 *   then register it in src/prototypes/registry.js
 */
export function ExampleLogin() {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const goToPassword = () => {
    if (!email.includes('@')) {
      setError('Enter a valid email address')
      return
    }
    setError('')
    setStep('password')
  }

  const submit = () => {
    if (password.length < 4) {
      setError('Password too short')
      return
    }
    setError('')
    setStep('done')
  }

  return (
    <ProtoFrame title="Login flow" note="v1 — two-step with inline error">
      <Flex justify="center" py={16} px={4}>
        <Box w="full" maxW="360px">
          <Frame label={`step: ${step}`}>
            {step === 'email' && (
              <Stack gap={3}>
                <Heading size="sm">Sign in</Heading>
                <Text fontSize="xs" color="fg.muted">
                  Enter your email to continue
                </Text>
                <Input
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && (
                  <Text fontSize="xs" color="fg">
                    ⚠ {error}
                  </Text>
                )}
                <Button onClick={goToPassword} variant="outline">
                  Continue →
                </Button>
              </Stack>
            )}

            {step === 'password' && (
              <Stack gap={3}>
                <Heading size="sm">Enter password</Heading>
                <Text fontSize="xs" color="fg.muted">
                  Signing in as {email}
                </Text>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && (
                  <Text fontSize="xs" color="fg">
                    ⚠ {error}
                  </Text>
                )}
                <Button onClick={submit} variant="outline">
                  Sign in
                </Button>
                <Button
                  onClick={() => {
                    setStep('email')
                    setError('')
                  }}
                  variant="ghost"
                  size="xs"
                >
                  ← use a different email
                </Button>
              </Stack>
            )}

            {step === 'done' && (
              <Stack gap={3}>
                <Heading size="sm">Signed in</Heading>
                <Text fontSize="xs" color="fg.muted">
                  Placeholder for post-login destination.
                </Text>
              </Stack>
            )}
          </Frame>

          <Annotate>
            Error message sits under the field, not as a toast. Intentional —
            keeps the user's eyes on what to fix.
          </Annotate>
        </Box>
      </Flex>
    </ProtoFrame>
  )
}
