import { UserRound } from 'lucide-react'
import { SkinViewer, type AccountPayload } from '@/entities/account'
import { formatDate } from '@/shared/lib/date/format-date'

type ProfileCharacterPanelProps = {
  account: AccountPayload
}

export function ProfileCharacterPanel({ account }: ProfileCharacterPanelProps) {
  const skinUuid = account.player.premiumUuid ?? account.player.uuid

  return (
    <div className="xk-profile-panel">
      <div className="xk-panel-heading">
        <div>
          <p className="xk-overline">Скин</p>
          <h2>Персонаж</h2>
        </div>
        <UserRound size={30} />
      </div>
      <SkinViewer nickname={account.player.nickname} uuid={skinUuid} />
      <div className="xk-profile-facts">
        <div>
          <span>Дата регистрации</span>
          <strong>{formatDate(account.player.registeredAt)}</strong>
        </div>
        <div>
          <span>Последний вход</span>
          <strong>{formatDate(account.player.lastLoginAt)}</strong>
        </div>
        <div>
          <span>2FA и уведомления</span>
          <strong>
            {account.player.social.totpEnabled
              ? '2FA включена'
              : '2FA выключена'}{' '}
            ·{' '}
            {account.player.social.notifyEnabled
              ? 'уведомления да'
              : 'уведомления нет'}
          </strong>
        </div>
      </div>
    </div>
  )
}
