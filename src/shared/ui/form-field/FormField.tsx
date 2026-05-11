import type { InputHTMLAttributes, ReactNode } from 'react'

type FormFieldProps = {
  label: string
  children?: ReactNode
  inputProps?: InputHTMLAttributes<HTMLInputElement>
}

export function FormField({ label, children, inputProps }: FormFieldProps) {
  return (
    <label className="xk-bank-field">
      <span>{label}</span>
      {children ?? <input {...inputProps} />}
    </label>
  )
}
