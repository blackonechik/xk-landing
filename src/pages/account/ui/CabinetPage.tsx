import { useEffect, useMemo, useState } from 'react'
import { LogOut, Shield, Signal, Swords } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { LandingButton } from '@/shared/ui/landing-button'
import { fetchAccount, logout, type AccountPayload } from '../model/api'
import { SkinViewer } from './SkinViewer'

function formatDate(value: string | null) {
  if (!value) {
    return 'нет данных'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function CabinetPage() {
  const navigate = useNavigate()
  const [account, setAccount] = useState<AccountPayload | null>(null)
  const [error, setError] = useState('')

  async function loadAccount() {
    try {
      const payload = await fetchAccount()
      setAccount(payload)
    } catch (loadError) {
      if (loadError instanceof Error && loadError.message === 'UNAUTHORIZED') {
        await navigate({ to: '/login' })
        return
      }

      setError('Не получилось загрузить кабинет.')
    }
  }

  useEffect(() => {
    void loadAccount()
  }, [])

  const totalDiamonds = useMemo(
    () =>
      account?.bank.cards.reduce((sum, card) => sum + card.balanceDiamonds, 0) ?? 0,
    [account],
  )

  if (!account) {
    return (
      <main className="xk-cabinet-page">
        <section className="page-wrap xk-cabinet-loading">Загружаем кабинет...</section>
      </main>
    )
  }

  const skinUuid = account.player.premiumUuid ?? account.player.uuid

  return (
    <main className="xk-cabinet-page">
      <section className="page-wrap xk-cabinet-hero">
        <div className="xk-cabinet-copy">
          <p className="xk-overline">Игровой профиль</p>
          <h2 className="xk-cabinet-name">{account.player.nickname}</h2>
          <div className="xk-cabinet-actions">
            <LandingButton href="/cabinet/bank" tone="success" arrow className="xk-cabinet-cta">
              Открыть XK Bank
            </LandingButton>
            <LandingButton href="/payment" tone="primary" arrow className="xk-cabinet-cta">
              Пополнить аккаунт
            </LandingButton>
          </div>
        </div>

        <button
          className="xk-cabinet-logout"
          type="button"
          onClick={async () => {
            await logout()
            await navigate({ to: '/' })
          }}
        >
          <LogOut size={18} />
          Выйти
        </button>
      </section>

      <section className="page-wrap xk-cabinet-grid">
        <div className="xk-profile-panel">
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

        <div className="xk-profile-summary-panel">
          <div className="xk-panel-heading">
            <div>
              <p className="xk-overline">Кратко</p>
              <h2>Статус аккаунта</h2>
            </div>
            <Shield size={30} />
          </div>

          <div className="xk-stat-grid">
            <span>Жизни</span>
            <strong>{account.player.lives}</strong>
            <span>Discord</span>
            <strong>связан</strong>
            <span>UUID</span>
            <strong>{account.player.premiumUuid ?? 'offline'}</strong>
            <span>Алмазы на картах</span>
            <strong>{totalDiamonds}</strong>
          </div>

          <div className="xk-bank-teaser">
            <div>
              <p className="xk-overline">XK Bank</p>
              <h3>{account.bank.cards.length} карт в системе</h3>
            </div>
            <LandingButton href="/cabinet/bank" tone="success" arrow className="xk-cabinet-cta xk-cabinet-cta_small">
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
      </section>

      {error ? <section className="page-wrap xk-cabinet-error">{error}</section> : null}
    </main>
  )
}