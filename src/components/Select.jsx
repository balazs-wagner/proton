import { NativeSelect } from '@chakra-ui/react'

/**
 * Simple native select wrapping Chakra v3's NativeSelect.
 * Props: value, onChange (fn receiving new value string),
 *        options: [{ value, label }]
 */
export function Select({ value, onChange, options, ...rest }) {
  return (
    <NativeSelect.Root {...rest}>
      <NativeSelect.Field
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  )
}
