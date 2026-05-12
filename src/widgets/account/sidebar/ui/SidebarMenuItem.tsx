import { Chip } from '@heroui/react'
import { SidebarButton } from './SidebarButton'
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
        className={['flex items-center gap-3', size === 'sm' ? 'text-sm' : '']
          .filter(Boolean)
          .join(' ')}
      >
        {icon}
        <span>{label}</span>
      </span>
      {badge ? <Chip variant="soft">{badge}</Chip> : null}
    </span>
  )
}

export function SidebarMenuItem({
  icon,
  label,
  to,
  onPress,
  current = false,
  disabled = false,
  size = 'lg',
  badge,
  children,
}: AccountSidebarMenuItemConfig) {
  const hasChildren = Boolean(children?.length)

  if (hasChildren) {
    return (
      <div className="xk-account-sidebar__group">
        <SidebarButton
          current={current}
          disabled={disabled}
          onPress={onPress}
          size={size}
          to={to}
        >
          <SidebarMenuItemContent
            badge={badge}
            icon={icon}
            label={label}
            size={size}
          />
        </SidebarButton>

        <div className="xk-account-sidebar__submenu">
          {children?.map((item) => {
            const { key, ...menuItem } = item

            return <SidebarMenuItem key={key} {...menuItem} />
          })}
        </div>
      </div>
    )
  }

  return (
    <SidebarButton
      current={current}
      disabled={disabled}
      onPress={onPress}
      size={size}
      to={to}
    >
      <SidebarMenuItemContent
        badge={badge}
        icon={icon}
        label={label}
        size={size}
      />
    </SidebarButton>
  )
}