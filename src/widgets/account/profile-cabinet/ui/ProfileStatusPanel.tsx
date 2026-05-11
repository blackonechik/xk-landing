import { Shield, Signal, Swords } from 'lucide-react'
import type { AccountPayload } from '@/entities/account'
import { LandingButton } from '@/shared/ui/landing-button'

type ProfileStatusPanelProps = {
  account: AccountPayload
  totalDiamonds: number
}

export function ProfileStatusPanel({
  account,
  totalDiamonds,
}: ProfileStatusPanelProps) {
  return (
    <div className="xk-profile-summary-panel">
      <div className="xk-panel-heading">
        <div>
          <p className="xk-overline">Кратко</p>
          <h2>Статус аккаунта</h2>
        </div>
        <Shield size={30} />
      </div>

      <div className="xk-profile-facts">
        <div>
          <span>Жизни</span>
          <strong>{account.player.lives}</strong>
        </div>
        <div>
          <span>Discord</span>
          <strong>связан</strong>
        </div>
        <div>
          <span>UUID</span>
          <strong>{account.player.premiumUuid ?? 'offline'}</strong>
        </div>
        <div>
          <span>Алмазы на картах</span>
          <strong>{totalDiamonds}</strong>
        </div>
      </div>

      <div className="xk-bank-teaser">
        <div>
          <p className="xk-overline">XK Bank</p>
          <h3>{account.bank.cards.length} карт в системе</h3>
          <p className="xk-muted">
            {totalDiamonds} алмазов доступно на активных картах.
          </p>
        </div>
        <LandingButton
          href="/cabinet/bank"
          tone="success"
          arrow
          className="xk-cabinet-cta xk-cabinet-cta_small"
        >
          Открыть банк
        </LandingButton>
      </div>

      <div className="xk-cabinet-tags">
        <span>
          <Swords size={16} /> Жизни: {account.player.lives}
        </span>
        <span>
          <Shield size={16} />{' '}
          {account.player.premiumUuid
            ? 'Premium UUID привязан'
            : 'Offline профиль'}
        </span>
        <span>
          <Signal size={16} /> Discord связан
        </span>
      </div>
    </div>
  )
}
