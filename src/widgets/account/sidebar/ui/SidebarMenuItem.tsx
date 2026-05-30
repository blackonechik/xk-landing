import { Button, Card, Chip } from '@heroui/react'
import type { AccountSidebarMenuItem as AccountSidebarMenuItemConfig } from '../model/account-sidebar-menu'

type SidebarMenuItemContentProps = {
  icon: React.ReactNode
  label: string
  badge?: string
  compact?: boolean
  size?: 'sm' | 'md' | 'lg'
}

function SidebarMenuItemContent({
  icon,
  label,
  badge,
  compact = false,
  size = 'lg',
}: SidebarMenuItemContentProps) {
  return (
    <span
      className={[
        'flex w-full items-center justify-between gap-3',
        compact ? 'justify-center' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        className={[
          'flex min-w-0 items-center gap-3',
          compact ? 'justify-center' : '',
          size === 'sm' ? 'text-sm' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span
          className={[
            'xk-account-sidebar__menu-icon shrink-0 text-muted',
            compact ? 'xk-account-sidebar__menu-icon_compact' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {icon}
        </span>
        {compact ? null : <span className="truncate">{label}</span>}
      </span>
      {!compact && badge ? <Chip variant="soft">{badge}</Chip> : null}
    </span>
  )
}

type SidebarMenuItemProps = AccountSidebarMenuItemConfig & {
  compact?: boolean
  onNavigate: (to: string) => void
}

export function SidebarMenuItem({
  icon,
  label,
  to,
  compact = false,
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
      aria-label={label}
      className={compact ? 'w-full justify-center px-0' : 'w-full justify-start'}
      fullWidth
      isDisabled={disabled}
      isIconOnly={compact}
      onPress={handlePress}
      size={size}
      title={compact ? label : undefined}
      variant={current ? 'secondary' : 'ghost'}
    >
      <SidebarMenuItemContent
        badge={badge}
        compact={compact}
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
        <div className={compact ? 'mt-2 grid gap-2' : 'mt-2 grid gap-2 pl-4'}>
          {children?.map((item) => {
            const { key, ...menuItem } = item

            return (
              <SidebarMenuItem
                key={key}
                compact={compact}
                onNavigate={onNavigate}
                {...menuItem}
              />
            )
          })}
        </div>
      </div>
    )
  }

  return button
}
