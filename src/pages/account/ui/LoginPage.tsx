import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { fetchAccount, getDiscordLoginUrl } from '../model/api'
import { LandingButton } from '@/shared/ui/landing-button'

const errorText: Record<string, string> = {
  DISCORD_NOT_CONFIGURED: 'Discord OAuth ещё не настроен на сервере.',
  DISCORD_NOT_LINKED: 'Этот Discord не привязан к аккаунту XK HARDCORE.',
  INVALID_OAUTH_STATE: 'Сессия входа устарела. Попробуй ещё раз.',
  DISCORD_TOKEN_FAILED: 'Discord не выдал токен входа.',
  DISCORD_USER_FAILED: 'Не получилось получить профиль Discord.',
}

export function LoginPage() {
  const navigate = useNavigate()
  const [authState, setAuthState] = useState<'checking' | 'guest'>('checking')
  const params =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : undefined
  const error = params?.get('error')

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
        if (isActive) {
          setAuthState('guest')
        }
      })

    return () => {
      isActive = false
    }
  }, [navigate])

  return (
    <main className="xk-login-page">
      <section className="xk-login-shell page-wrap">
        <div className="xk-login-copy">
          <p className="xk-overline">Личный кабинет</p>
          <h1>Вход через Discord</h1>
          <p>
            Вход идёт через Discord и сразу открывает профиль игрока, если
            сессия уже активна.
          </p>
        </div>

        <div className="xk-login-panel">
          <div className="xk-login-panel__badge">
            <ShieldCheck size={18} />
            Discord OAuth
          </div>
          <h2>Без паролей на сайте</h2>
          <p>
            Мы проверим текущую сессию и, если ты уже вошёл, сразу откроем
            кабинет. Иначе запустим авторизацию Discord.
          </p>
          {error ? (
            <div className="xk-login-error">
              {errorText[error] ?? 'Не удалось войти через Discord.'}
            </div>
          ) : null}
          {authState === 'checking' ? (
            <p className="xk-login-status">Проверяем вход...</p>
          ) : (
            <LandingButton href={getDiscordLoginUrl()} tone="success" arrow>
              Войти через Discord
            </LandingButton>
          )}
        </div>
      </section>
    </main>
  )
}
