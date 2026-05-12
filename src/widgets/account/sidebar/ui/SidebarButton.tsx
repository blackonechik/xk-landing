import { Button, buttonVariants } from '@heroui/react'
import AnimatedLink from '@/components/AnimatedLink'

type SidebarButtonProps = {
  children: React.ReactNode
  current?: boolean
  onPress?: () => void
  to?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function SidebarButton({
  children,
  current = false,
  onPress,
  to,
  disabled = false,
  size = 'lg',
}: SidebarButtonProps) {
  const className = 'w-full justify-start'
  const variant = current ? 'secondary' : 'ghost'

  if (to) {
    return (
      <AnimatedLink
        className={buttonVariants({
          className,
          size,
          variant,
        })}
        to={to}
      >
        {children}
      </AnimatedLink>
    )
  }

  return (
    <Button
      className={className}
      isDisabled={disabled}
      onPress={onPress}
      size={size}
      variant={variant}
    >
      {children}
    </Button>
  )
}