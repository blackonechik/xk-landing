import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { fetchAccount, getDiscordLoginUrl } from '@/entities/account'
import { LandingButton } from '@/shared/ui/landing-button'
import AnimatedLink from '@/components/AnimatedLink'

export function LoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    let isActive = true

    void fetchAccount()
      .then(() => {
        if (!isActive) {
          return
        }

        void navigate({ to: '/cabinet' })
      })
      .catch(() => {
        if (!isActive) {
          return
        }
      })

    return () => {
      isActive = false
    }
  }, [navigate])

  return (
    <main className="xk-login-page">
      <section className="xk-login-shell page-wrap">
        <div className="xk-login-card">
          <h1 className="xk-login-card__title">Авторизация</h1>
          <p>Авторизуйтесь на сайте, чтобы управлять своим аккаунтом.</p>
          <LandingButton
            href={getDiscordLoginUrl()}
            tone="success"
            size="small"
          >
            Вход через Discord
          </LandingButton>
          <AnimatedLink className="xk-login-terms" to="/offer">
            Условия использования
          </AnimatedLink>
        </div>
      </section>
    </main>
  )
}
