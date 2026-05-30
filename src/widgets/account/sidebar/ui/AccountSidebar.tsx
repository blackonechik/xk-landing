import { useEffect, useState } from 'react'
import { Button, Card, Chip, ScrollShadow, Text } from '@heroui/react'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import {
  getPrimaryRoleLabel,
  isAdminRole,
  normalizePlayerRoles,
  PlayerAvatar,
} from '@/entities/account'
import type { AccountPayload } from '@/entities/account'
import { fetchSiteSettingsCached, type SiteSettings } from '@/entities/site'
import type { BankView } from '@/widgets/account/bank-cabinet'
import {
  getAccountSidebarMenuSections,
  type AdminView,
} from '../model/account-sidebar-menu'
import { SidebarMenuItem } from './SidebarMenuItem'

type AccountSidebarProps = {
  account: AccountPayload
  compact?: boolean
  currentSection: 'home' | 'bank' | 'stats' | 'news' | 'admin'
  activeBankView?: BankView
  activeAdminView?: AdminView
  onNavigate: (to: string) => void
  onBankViewNavigate: (view: BankView) => void
  onAdminViewNavigate?: (view: AdminView) => void
  onCompactToggle: () => void
}

export function AccountSidebar({
  account,
  compact = false,
  currentSection,
  activeBankView = 'cards',
  activeAdminView = 'overview',
  onNavigate,
  onBankViewNavigate,
  onAdminViewNavigate,
  onCompactToggle,
}: AccountSidebarProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    let isActive = true

    void fetchSiteSettingsCached()
      .then((payload) => {
        if (isActive) {
          setSettings(payload)
        }
      })
      .catch(() => {
        if (isActive) {
          setSettings({ navigation: { showBank: true, items: [] } })
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  const sections = getAccountSidebarMenuSections({
    currentSection,
    activeBankView,
    activeAdminView,
    hasBankCards: account.bank.cards.length > 0,
    roles: normalizePlayerRoles(account.player.roles, account.player.siteRole) as Array<
      'player' | 'moderator' | 'admin'
    >,
    navigationItems: settings?.navigation.items,
    onBankViewNavigate,
    onAdminViewNavigate,
  })

  return (
    <Card
      className="xk-account-sidebar flex h-full flex-col gap-5 rounded-[28px] border"
      data-compact={compact ? 'true' : 'false'}
      variant="secondary"
    >
      <Card.Header className="flex flex-col gap-4 p-0">
        <div className="xk-account-sidebar__profile flex items-center gap-3">
          <PlayerAvatar
            className="size-14 shrink-0 border border-[var(--separator)] bg-[var(--surface-secondary)]"
            nickname={account.player.nickname}
          />
          <div className="xk-account-sidebar__profile-copy min-w-0 grid gap-1">
            <Text className="truncate text-[18px] font-semibold">
              {account.player.nickname}
            </Text>
            <div className="xk-account-sidebar__profile-meta flex flex-wrap items-center gap-2">
              <Chip
                color={isAdminRole(account.player.roles) ? 'accent' : 'default'}
                variant="soft"
              >
                {getPrimaryRoleLabel(account.player.roles)}
              </Chip>
            </div>
          </div>
        </div>
      </Card.Header>

      <div className="h-px bg-[var(--separator)]/70" />

      <Card.Content className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-0">
        <ScrollShadow
          className="min-h-0 flex-1 pr-1"
          hideScrollBar
          orientation="vertical"
        >
          <div className="grid gap-2">
            <Text
              className="xk-account-sidebar__section-title text-[12px] uppercase tracking-[0.08em]"
              color="muted"
            >
              Навигация
            </Text>
            {sections.flatMap((section) =>
              section.items.map((item) => {
                const { key, ...menuItem } = item

                return (
                  <SidebarMenuItem
                    key={key}
                    compact={compact}
                    onNavigate={onNavigate}
                    {...menuItem}
                  />
                )
              }),
            )}
          </div>
        </ScrollShadow>
      </Card.Content>

      <div className="h-px bg-[var(--separator)]/70" />

      <Card.Footer className="xk-account-sidebar__footer flex items-center justify-between gap-3 p-0">
        <div className="xk-account-sidebar__footer-theme flex items-center gap-3">
          <Text
            className="xk-account-sidebar__theme-label text-[12px] uppercase tracking-[0.08em]"
            color="muted"
          >
            Тема
          </Text>
          <ThemeToggle />
        </div>
        <div className="xk-account-sidebar__footer-controls flex items-center gap-2">
          <Button
            aria-label={
              compact ? 'Развернуть боковое меню кабинета' : 'Сделать боковое меню компактным'
            }
            isIconOnly
            size="sm"
            title={compact ? 'Развернуть меню' : 'Свернуть меню'}
            variant="ghost"
            onPress={onCompactToggle}
          >
            {compact ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </Button>
        </div>
      </Card.Footer>
    </Card>
  )
}
