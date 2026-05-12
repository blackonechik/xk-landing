import { Button, Card, Chip, Text } from '@heroui/react'
import ThemeToggle from '@/components/ThemeToggle'
import { PlayerAvatar } from '@/entities/account'
import type { AccountPayload } from '@/entities/account'
import type { BankView } from '@/widgets/account/bank-cabinet'
import { getAccountSidebarMenuSections } from '../model/account-sidebar-menu'
import { SidebarMenuItem } from './SidebarMenuItem'

type AccountSidebarProps = {
  account: AccountPayload
  currentSection: 'home' | 'bank'
  activeBankView?: BankView
  onNavigate: (to: string) => void
  onBankViewNavigate: (view: BankView) => void
}

export function AccountSidebar({
  account,
  currentSection,
  activeBankView = 'cards',
  onNavigate,
  onBankViewNavigate,
}: AccountSidebarProps) {
  const sections = getAccountSidebarMenuSections({
    currentSection,
    activeBankView,
    onBankViewNavigate,
  })

  return (
    <Card
      className="flex h-full flex-col gap-5 rounded-[28px] border border-[var(--separator)] bg-[var(--surface)] p-5 shadow-[0_24px_48px_rgba(0,0,0,0.2)]"
      variant="secondary"
    >
      <Card.Header className="flex flex-col gap-4 p-0">

        <div className="flex items-center gap-3">
          <PlayerAvatar
            className="size-14 shrink-0 border border-[var(--separator)] bg-[var(--surface-secondary)]"
            nickname={account.player.nickname}
          />
          <div className="min-w-0 grid gap-1">
            <Text className="truncate text-[18px] font-semibold">
              {account.player.nickname}
            </Text>
            <div className="flex flex-wrap items-center gap-2">
              <Chip color="accent" variant="soft">
                Админ
              </Chip>
            </div>
          </div>
        </div>
      </Card.Header>

      <div className="h-px bg-[var(--separator)]/70" />

      <Card.Content className="flex min-h-0 flex-1 flex-col gap-4 p-0">
        <div className="grid gap-2">
          <Text className="text-[12px] uppercase tracking-[0.08em]" color="muted">
            Навигация
          </Text>
          {sections.flatMap((section) =>
            section.items.map((item) => {
              const { key, ...menuItem } = item

              return (
                <SidebarMenuItem
                  key={key}
                  onNavigate={onNavigate}
                  {...menuItem}
                />
              )
            }),
          )}
        </div>
      </Card.Content>

      <div className="h-px bg-[var(--separator)]/70" />

      <Card.Footer className="flex items-center justify-center gap-3 p-0">
        <Text className="text-[12px] uppercase tracking-[0.08em]" color="muted">
          Тема
        </Text>
        <ThemeToggle />
      </Card.Footer>
    </Card>
  )
}
