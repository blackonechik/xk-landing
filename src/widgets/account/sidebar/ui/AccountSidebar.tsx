import { Chip } from '@heroui/react'
import { Grid2x2 } from 'lucide-react'
import AnimatedLink from '@/components/AnimatedLink'
import { PlayerAvatar } from '@/entities/account'
import type { AccountPayload } from '@/entities/account'
import type { BankView } from '@/widgets/account/bank-cabinet'
import { getAccountSidebarMenuSections } from '../model/account-sidebar-menu'
import { SidebarMenuItem } from './SidebarMenuItem'

type AccountSidebarProps = {
  account: AccountPayload
  currentSection: 'home' | 'bank'
  activeBankView?: BankView
  onBankViewNavigate: (view: BankView) => void
}

export function AccountSidebar({
  account,
  currentSection,
  activeBankView = 'cards',
  onBankViewNavigate,
}: AccountSidebarProps) {
  const sections = getAccountSidebarMenuSections({
    currentSection,
    activeBankView,
    onBankViewNavigate,
  })

  return (
    <aside className="xk-account-sidebar">
      <div className="xk-account-sidebar__top">
        <AnimatedLink className="xk-account-sidebar__brand" to="/">
          XK HARDCORE
        </AnimatedLink>

        <div className="xk-account-sidebar__player">
          <PlayerAvatar
            className="xk-account-sidebar__avatar"
            nickname={account.player.nickname}
          />
          <div className="xk-account-sidebar__player-copy">
            <strong>{account.player.nickname}</strong>
            <span>Личный кабинет игрока</span>
          </div>
        </div>
      </div>

      <div className="xk-account-sidebar__section">
        <div className="xk-account-sidebar__section-label">Навигация</div>

        <div className="xk-account-sidebar__menu">
          {sections.flatMap((section) =>
            section.items.map((item) => {
              const { key, ...menuItem } = item

              return <SidebarMenuItem key={key} {...menuItem} />
            }),
          )}
        </div>
      </div>

    </aside>
  )
}