import { useMemo, useState } from 'react'
import { fetchAdminDashboard } from '../model/api'
import type { AdminDashboard } from '../model/api'
import { LandingButton } from '@/shared/ui/landing-button'
import { LandingCard } from '@/shared/ui/landing-card'
import { LandingSection } from '@/shared/ui/landing-section'

const tokenStorageKey = 'xk-admin-token'

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date)
}

export function AdminPage() {
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') {
      return ''
    }

    return window.localStorage.getItem(tokenStorageKey) ?? ''
  })
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const stats = useMemo(() => {
    const payments = dashboard?.payments ?? []
    const paidCount = payments.filter((item) => item.status === 'paid').length
    const pendingCount = payments.filter((item) => item.status === 'pending').length

    return {
      totalPayments: payments.length,
      paidCount,
      pendingCount,
      totalLifeLogs: dashboard?.lifeLogs.length ?? 0,
    }
  }, [dashboard])

  async function loadDashboard() {
    if (!token.trim()) {
      setError('Введите admin token.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const data = await fetchAdminDashboard(token.trim())
      setDashboard(data)
      window.localStorage.setItem(tokenStorageKey, token.trim())
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ошибка загрузки данных.')
      setDashboard(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="tycoon-landing xk-admin-page">
      <LandingSection
        id="admin"
        tone="blue"
        title="Админка"
        mark="Платежи и начисления"
        titleClassName="tycoon-color-yellow"
        markClassName="tycoon-color-orange-2"
        wrapperClassName="xk-payment-wrapper"
        withEffect
        withEnding
        withLine={false}
      >
        <div className="xk-admin-layout mt-20">
          <LandingCard title="Доступ" tone="gold" contentClassName="xk-payment-card" infoClassName="xk-admin-panel">
            <label className="xk-payment-field">
              <span>Admin token</span>
              <input
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Введите ADMIN_TOKEN"
                autoComplete="off"
              />
            </label>

            <div className="xk-admin-actions">
              <LandingButton
                as="button"
                type="button"
                tone="success"
                contentClassName="xk-payment-summary__submit-content"
                onClick={() => void loadDashboard()}
                disabled={isLoading}
                arrow
              >
                {isLoading ? 'Загружаем' : 'Обновить данные'}
              </LandingButton>
            </div>

            {error ? <p className="xk-payment-error">{error}</p> : null}
          </LandingCard>

          {dashboard ? (
            <>
              <LandingCard title="Сводка" tone="green" contentClassName="xk-payment-card" infoClassName="xk-admin-panel">
                <div className="xk-admin-stats">
                  <p>Платежей всего: <strong>{stats.totalPayments}</strong></p>
                  <p>Оплачено: <strong>{stats.paidCount}</strong></p>
                  <p>В ожидании: <strong>{stats.pendingCount}</strong></p>
                  <p>Начислений жизней: <strong>{stats.totalLifeLogs}</strong></p>
                </div>
              </LandingCard>

              <LandingCard title="Платежи" tone="blue" contentClassName="xk-payment-card" infoClassName="xk-admin-panel">
                <div className="xk-admin-table-wrap">
                  <table className="xk-admin-table" aria-label="Список платежей">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Ник</th>
                        <th>Товар</th>
                        <th>Сумма</th>
                        <th>Статус</th>
                        <th>Создан</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.payments.map((row) => (
                        <tr key={row.id}>
                          <td>{row.id}</td>
                          <td>{row.nickname}</td>
                          <td>{row.productName}</td>
                          <td>{row.amountRub} руб.</td>
                          <td>{row.status}</td>
                          <td>{formatDate(row.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </LandingCard>

              <LandingCard title="Логи жизней" tone="violet" contentClassName="xk-payment-card" infoClassName="xk-admin-panel">
                <div className="xk-admin-table-wrap">
                  <table className="xk-admin-table" aria-label="Логи начисления жизней">
                    <thead>
                      <tr>
                        <th>Игрок</th>
                        <th>UUID</th>
                        <th>Изменение</th>
                        <th>Было</th>
                        <th>Стало</th>
                        <th>Время</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.lifeLogs.map((row) => (
                        <tr key={row.id}>
                          <td>{row.playerName}</td>
                          <td>{row.playerUuid}</td>
                          <td>{row.livesDelta > 0 ? `+${row.livesDelta}` : row.livesDelta}</td>
                          <td>{row.previousLives}</td>
                          <td>{row.newLives}</td>
                          <td>{formatDate(row.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </LandingCard>
            </>
          ) : null}
        </div>
      </LandingSection>
    </main>
  )
}
