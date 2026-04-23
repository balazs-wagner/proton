import { Switch as ChakraSwitch } from '@chakra-ui/react'

/**
 * Simple on/off toggle wrapping Chakra v3's compound Switch.
 * Props: checked (bool), onChange (fn receiving new bool value)
 */
export function Switch({ checked, onChange, ...rest }) {
  return (
    <ChakraSwitch.Root
      checked={checked}
      onCheckedChange={(e) => onChange(e.checked)}
      {...rest}
    >
      <ChakraSwitch.HiddenInput />
      <ChakraSwitch.Control>
        <ChakraSwitch.Thumb />
      </ChakraSwitch.Control>
    </ChakraSwitch.Root>
  )
}
