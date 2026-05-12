import { LogoutButton } from '@/features/auth/logout'

type ProfileHeroProps = {
  onLogout: () => Promise<void>
}

export function ProfileHero({ onLogout }: ProfileHeroProps) {
  return (
    <section className="page-wrap xk-cabinet-hero">
      <div className="xk-cabinet-copy">
        <h2 className="xk-cabinet-title">Личный кабинет</h2>
      </div>

      <LogoutButton icon onLogout={onLogout} />
    </section>
  )
}
