import { Disc3, ShieldCheck } from 'lucide-react'
import { getDiscordLoginUrl } from '../model/api'

const errorText: Record<string, string> = {
  DISCORD_NOT_CONFIGURED: 'Discord OAuth ещё не настроен на сервере.',
  DISCORD_NOT_LINKED: 'Этот Discord не привязан к аккаунту XK HARDCORE.',
  INVALID_OAUTH_STATE: 'Сессия входа устарела. Попробуй ещё раз.',
  DISCORD_TOKEN_FAILED: 'Discord не выдал токен входа.',
  DISCORD_USER_FAILED: 'Не получилось получить профиль Discord.',
}

export function LoginPage() {
  const params =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : undefined
  const error = params?.get('error')

  return (
    <main className="xk-login-page">
      <section className="xk-login-shell page-wrap">
        <div className="xk-login-copy">
          <p className="xk-overline">Личный кабинет</p>
          <h1>Вход через Discord</h1>
          <p>
            Авторизация использует привязку LimboAuth SocialAddon: зайди тем
            Discord-аккаунтом, который уже связан с ником на сервере.
          </p>
        </div>

        <div className="xk-login-panel">
          <div className="xk-login-panel__badge">
            <ShieldCheck size={18} />
            LimboAuth Social
          </div>
          <h2>Без паролей на сайте</h2>
          <p>
            Мы проверим Discord ID, найдём запись в таблице SOCIAL и откроем
            кабинет твоего Minecraft-профиля.
          </p>
          {error ? (
            <div className="xk-login-error">
              {errorText[error] ?? 'Не удалось войти через Discord.'}
            </div>
          ) : null}
          <a className="xk-discord-button" href={getDiscordLoginUrl()}>
            <Disc3 size={20} />
            Войти через Discord
          </a>
        </div>
      </section>
    </main>
  )
}
