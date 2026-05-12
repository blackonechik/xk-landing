import { Button, Card, Chip } from '@heroui/react'
import type { AccountSidebarMenuItem as AccountSidebarMenuItemConfig } from '../model/account-sidebar-menu'

type SidebarMenuItemContentProps = {
  icon: React.ReactNode
  label: string
  badge?: string
  size?: 'sm' | 'md' | 'lg'
}

function SidebarMenuItemContent({
  icon,
  label,
  badge,
  size = 'lg',
}: SidebarMenuItemContentProps) {
  return (
    <span className="flex w-full items-center justify-between gap-3">
      <span
        className={[
          'flex min-w-0 items-center gap-3',
          size === 'sm' ? 'text-sm' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="shrink-0 text-muted">{icon}</span>
        <span className="truncate">{label}</span>
      </span>
      {badge ? <Chip variant="soft">{badge}</Chip> : null}
    </span>
  )
}

type SidebarMenuItemProps = AccountSidebarMenuItemConfig & {
  onNavigate: (to: string) => void
}

export function SidebarMenuItem({
  icon,
  label,
  to,
  onNavigate,
  onPress,
  current = false,
  disabled = false,
  size = 'lg',
  badge,
  children,
}: SidebarMenuItemProps) {
  const hasChildren = Boolean(children?.length)

  function handlePress() {
    if (disabled) {
      return
    }

    if (to) {
      onNavigate(to)
      return
    }

    onPress?.()
  }

  const button = (
    <Button
      aria-current={current ? 'page' : undefined}
      className="w-full justify-start"
      fullWidth
      isDisabled={disabled}
      onPress={handlePress}
      size={size}
      variant={current ? 'secondary' : 'ghost'}
    >
      <SidebarMenuItemContent
        badge={badge}
        icon={icon}
        label={label}
        size={size}
      />
    </Button>
  )

  if (hasChildren) {
    return (
      <div className="flex flex-col">
        {button}
        <div className="mt-2 grid gap-2 pl-4">
          {children?.map((item) => {
            const { key, ...menuItem } = item

            return <SidebarMenuItem key={key} onNavigate={onNavigate} {...menuItem} />
          })}
        </div>
      </div>
    )
  }

  return button
}
