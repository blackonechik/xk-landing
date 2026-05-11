import { Shield } from 'lucide-react'
import type { AccountPayload } from '@/entities/account'
import { formatDate } from '@/shared/lib/date/format-date'
import { InfoTile } from '@/shared/ui/info-tile'
import { ActionButtons } from '@/shared/ui/action-buttons'
import { SectionHeader } from '@/shared/ui/section-header'
import { SurfaceCard } from '@/shared/ui/surface-card'

type ProfileStatusPanelProps = {
  account: AccountPayload
  totalDiamonds: number
}

export function ProfileStatusPanel({
  account,
  totalDiamonds,
}: ProfileStatusPanelProps) {
  return (
    <SurfaceCard className="xk-profile-summary-panel">
      <SectionHeader
        eyebrow="Кратко"
        title="Статус аккаунта"
        icon={<Shield size={30} />}
      />

      <div className="xk-profile-facts">
        <InfoTile label="Ник" value={account.player.nickname} />
        <InfoTile label="Жизни" value={account.player.lives} />
        <InfoTile
          label="Последний вход"
          value={formatDate(account.player.lastLoginAt)}
        />
        <InfoTile label="Discord" value="связан" />
        <InfoTile
          label="UUID"
          value={account.player.premiumUuid ?? 'offline'}
        />
        <InfoTile label="Алмазы на картах" value={totalDiamonds} />
      </div>

      <ActionButtons
        className="xk-cabinet-actions_compact"
        items={[
          { href: '/cabinet/bank', label: 'XK Bank', tone: 'success' },
          { href: '/payment', label: 'Пополнить', tone: 'primary' },
        ]}
      />

      <div className="xk-bank-teaser">
        <div>
          <p className="xk-overline">XK Bank</p>
          <h3>{account.bank.cards.length} карт в системе</h3>
          <p className="xk-muted">
            {totalDiamonds} алмазов доступно на активных картах.
          </p>
        </div>
      </div>
    </SurfaceCard>
  )
}
