import { UserRound } from 'lucide-react'
import { SkinViewer, type AccountPayload } from '@/entities/account'
import { formatDate } from '@/shared/lib/date/format-date'
import { InfoTile } from '@/shared/ui/info-tile'
import { SectionHeader } from '@/shared/ui/section-header'
import { SurfaceCard } from '@/shared/ui/surface-card'

type ProfileCharacterPanelProps = {
  account: AccountPayload
}

export function ProfileCharacterPanel({ account }: ProfileCharacterPanelProps) {
  const skinUuid = account.player.premiumUuid ?? account.player.uuid

  return (
    <SurfaceCard className="xk-profile-panel">
      <SectionHeader
        eyebrow="Скин"
        title="Персонаж"
        icon={<UserRound size={30} />}
      />
      <SkinViewer nickname={account.player.nickname} uuid={skinUuid} />
      <div className="xk-profile-facts">
        <InfoTile
          label="Дата регистрации"
          value={formatDate(account.player.registeredAt)}
        />
        <InfoTile
          label="Последний вход"
          value={formatDate(account.player.lastLoginAt)}
        />
        <InfoTile
          label="2FA и уведомления"
          value={
            <>
              {account.player.social.totpEnabled
                ? '2FA включена'
                : '2FA выключена'}{' '}
              ·{' '}
              {account.player.social.notifyEnabled
                ? 'уведомления да'
                : 'уведомления нет'}
            </>
          }
        />
      </div>
    </SurfaceCard>
  )
}
