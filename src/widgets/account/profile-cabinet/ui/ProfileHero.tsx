import type { AccountPayload } from '@/entities/account'
import { LogoutButton } from '@/features/auth/logout'
import { LandingButton } from '@/shared/ui/landing-button'

type ProfileHeroProps = {
  account: AccountPayload
  totalDiamonds: number
  onLogout: () => Promise<void>
}

export function ProfileHero({
  account,
  totalDiamonds,
  onLogout,
}: ProfileHeroProps) {
  return (
    <section className="page-wrap xk-cabinet-hero">
      <div className="xk-cabinet-copy">
        <p className="xk-overline">Игровой профиль</p>
        <h2 className="xk-cabinet-name">{account.player.nickname}</h2>
        <div className="xk-cabinet-hero-stats">
          <div>
            <span>Жизни</span>
            <strong>{account.player.lives}</strong>
          </div>
          <div>
            <span>Карты</span>
            <strong>{account.bank.cards.length}</strong>
          </div>
          <div>
            <span>Алмазы</span>
            <strong>{totalDiamonds}</strong>
          </div>
        </div>
        <div className="xk-cabinet-actions">
          <LandingButton
            href="/cabinet/bank"
            tone="success"
            arrow
            className="xk-cabinet-cta"
          >
            Открыть XK Bank
          </LandingButton>
          <LandingButton
            href="/payment"
            tone="primary"
            arrow
            className="xk-cabinet-cta"
          >
            Пополнить аккаунт
          </LandingButton>
        </div>
      </div>

      <LogoutButton icon onLogout={onLogout} />
    </section>
  )
}
