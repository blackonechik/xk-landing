import type { ComponentProps } from 'react'
import { Description, Input, Label, TextField } from '@heroui/react'

type LabeledInputProps = {
  label: string
  description?: string
  name?: string
} & ComponentProps<typeof Input>

export function LabeledInput({
  label,
  description,
  name,
  ...inputProps
}: LabeledInputProps) {
  return (
    <TextField className="grid gap-2" name={name}>
      <Label>{label}</Label>
      <Input {...inputProps} aria-label={inputProps['aria-label'] ?? label} />
      {description ? <Description>{description}</Description> : null}
    </TextField>
  )
}
