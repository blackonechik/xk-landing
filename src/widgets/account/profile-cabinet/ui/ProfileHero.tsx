import { LogoutButton } from '@/features/auth/logout'

type ProfileHeroProps = {
  onLogout: () => Promise<void>
}

export function ProfileHero({ onLogout }: ProfileHeroProps) {
  return (
    <section className="page-wrap xk-cabinet-hero">
      <div className="xk-cabinet-copy">
        <p className="xk-overline">Игровой профиль</p>
        <h2 className="xk-cabinet-title">Личный кабинет</h2>
        <p className="xk-cabinet-lead">
          Здесь собраны данные профиля, скин, состояние банка и быстрые действия
          по аккаунту.
        </p>
      </div>

      <LogoutButton icon onLogout={onLogout} />
    </section>
  )
}
