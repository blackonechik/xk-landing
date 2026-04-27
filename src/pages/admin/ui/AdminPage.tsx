import { useMemo, useState } from 'react'
import {
  createPromoCode,
  fetchAdminDashboard,
  fetchPromoCodes,
  updatePromoCode,
} from '../model/api'
import type { AdminDashboard, AdminPromoCodeRow } from '../model/api'
import { LandingButton } from '@/shared/ui/landing-button'
import { LandingCard } from '@/shared/ui/landing-card'
import { LandingSection } from '@/shared/ui/landing-section'

const tokenStorageKey = 'xk-admin-token'

function formatDate(value: string | null) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date)
}

function parseOptionalPositiveInt(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  const parsed = Number(trimmed)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined
  }

  return parsed
}

function formatPromoDiscount(promo: AdminPromoCodeRow) {
  return promo.discountType === 'percent' ? `${promo.discountValue}%` : `${promo.discountValue} руб.`
}

export function AdminPage() {
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') {
      return ''
    }

    return window.localStorage.getItem(tokenStorageKey) ?? ''
  })
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null)
  const [promoCodes, setPromoCodes] = useState<AdminPromoCodeRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingPromo, setIsSavingPromo] = useState(false)
  const [error, setError] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent')
  const [discountValue, setDiscountValue] = useState('10')
  const [maxUses, setMaxUses] = useState('')
  const [maxUsesPerNickname, setMaxUsesPerNickname] = useState('1')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')

  const stats = useMemo(() => {
    const payments = dashboard?.payments ?? []
    const paidCount = payments.filter((item) => item.status === 'paid').length
    const pendingCount = payments.filter((item) => item.status === 'pending').length

    return {
      totalPayments: payments.length,
      paidCount,
      pendingCount,
      totalLifeLogs: dashboard?.lifeLogs.length ?? 0,
      totalPromoCodes: promoCodes.length,
      activePromoCodes: promoCodes.filter((item) => item.isActive).length,
    }
  }, [dashboard, promoCodes])

  async function loadDashboard() {
    if (!token.trim()) {
      setError('Введите admin token.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const [dashboardData, promoData] = await Promise.all([
        fetchAdminDashboard(token.trim()),
        fetchPromoCodes(token.trim()),
      ])

      setDashboard(dashboardData)
      setPromoCodes(promoData)
      window.localStorage.setItem(tokenStorageKey, token.trim())
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ошибка загрузки данных.')
      setDashboard(null)
      setPromoCodes([])
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreatePromo() {
    if (!token.trim()) {
      setError('Введите admin token.')
      return
    }

    const normalizedCode = promoCode.trim().toUpperCase()

    if (!normalizedCode) {
      setError('Введите код промокода.')
      return
    }

    const parsedDiscountValue = parseOptionalPositiveInt(discountValue)

    if (!parsedDiscountValue) {
      setError('discountValue должен быть целым числом больше 0.')
      return
    }

    const parsedMaxUses = parseOptionalPositiveInt(maxUses)
    if (maxUses.trim() && !parsedMaxUses) {
      setError('maxUses должен быть целым числом больше 0.')
      return
    }

    const parsedMaxUsesPerNickname = parseOptionalPositiveInt(maxUsesPerNickname)
    if (maxUsesPerNickname.trim() && !parsedMaxUsesPerNickname) {
      setError('maxUsesPerNickname должен быть целым числом больше 0.')
      return
    }

    setError('')
    setIsSavingPromo(true)

    try {
      const promo = await createPromoCode(token.trim(), {
        code: normalizedCode,
        discountType,
        discountValue: parsedDiscountValue,
        maxUses: parsedMaxUses,
        maxUsesPerNickname: parsedMaxUsesPerNickname,
        startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
        endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
      })

      setPromoCodes((prev) => [promo, ...prev])
      setPromoCode('')
      setDiscountType('percent')
      setDiscountValue('10')
      setMaxUses('')
      setMaxUsesPerNickname('1')
      setStartsAt('')
      setEndsAt('')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось создать промокод.')
    } finally {
      setIsSavingPromo(false)
    }
  }

  async function handleTogglePromoActive(promo: AdminPromoCodeRow) {
    if (!token.trim()) {
      setError('Введите admin token.')
      return
    }

    setError('')

    try {
      const updated = await updatePromoCode(token.trim(), promo.id, {
        isActive: !promo.isActive,
      })

      setPromoCodes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось обновить промокод.')
    }
  }

  return (
    <main className="tycoon-landing xk-admin-page">
      <LandingSection
        id="admin"
        tone="blue"
        title="Админка"
        mark="Платежи, начисления и промокоды"
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
                  <p>Промокодов: <strong>{stats.totalPromoCodes}</strong></p>
                  <p>Активных промокодов: <strong>{stats.activePromoCodes}</strong></p>
                </div>
              </LandingCard>

              <LandingCard title="Создать промокод" tone="orange" contentClassName="xk-payment-card" infoClassName="xk-admin-panel">
                <div className="xk-admin-promo-form">
                  <label className="xk-payment-field">
                    <span>Код</span>
                    <input
                      value={promoCode}
                      onChange={(event) => setPromoCode(event.target.value.toUpperCase())}
                      placeholder="WELCOME10"
                      autoComplete="off"
                      maxLength={32}
                    />
                  </label>

                  <div className="xk-payment-contact-grid">
                    <label className="xk-payment-field">
                      <span>Тип скидки</span>
                      <select
                        value={discountType}
                        onChange={(event) => setDiscountType(event.target.value as 'percent' | 'fixed')}
                      >
                        <option value="percent">Проценты</option>
                        <option value="fixed">Фиксированная сумма (руб.)</option>
                      </select>
                    </label>

                    <label className="xk-payment-field">
                      <span>Значение скидки</span>
                      <input
                        value={discountValue}
                        onChange={(event) => setDiscountValue(event.target.value)}
                        placeholder={discountType === 'percent' ? '10' : '50'}
                        inputMode="numeric"
                      />
                    </label>
                  </div>

                  <div className="xk-payment-contact-grid">
                    <label className="xk-payment-field">
                      <span>Лимит использований (опционально)</span>
                      <input
                        value={maxUses}
                        onChange={(event) => setMaxUses(event.target.value)}
                        placeholder="100"
                        inputMode="numeric"
                      />
                    </label>

                    <label className="xk-payment-field">
                      <span>Лимит на никнейм (опционально)</span>
                      <input
                        value={maxUsesPerNickname}
                        onChange={(event) => setMaxUsesPerNickname(event.target.value)}
                        placeholder="1"
                        inputMode="numeric"
                      />
                    </label>
                  </div>

                  <div className="xk-payment-contact-grid">
                    <label className="xk-payment-field">
                      <span>Активен с (опционально)</span>
                      <input
                        type="datetime-local"
                        value={startsAt}
                        onChange={(event) => setStartsAt(event.target.value)}
                      />
                    </label>

                    <label className="xk-payment-field">
                      <span>Активен до (опционально)</span>
                      <input
                        type="datetime-local"
                        value={endsAt}
                        onChange={(event) => setEndsAt(event.target.value)}
                      />
                    </label>
                  </div>

                  <div className="xk-admin-actions">
                    <LandingButton
                      as="button"
                      type="button"
                      tone="success"
                      contentClassName="xk-payment-summary__submit-content"
                      onClick={() => void handleCreatePromo()}
                      disabled={isSavingPromo}
                      arrow
                    >
                      {isSavingPromo ? 'Сохраняем' : 'Создать промокод'}
                    </LandingButton>
                  </div>
                </div>
              </LandingCard>

              <LandingCard title="Промокоды" tone="blue" contentClassName="xk-payment-card" infoClassName="xk-admin-panel">
                <div className="xk-admin-table-wrap">
                  <table className="xk-admin-table" aria-label="Список промокодов">
                    <thead>
                      <tr>
                        <th>Код</th>
                        <th>Скидка</th>
                        <th>Лимит</th>
                        <th>На ник</th>
                        <th>Использовано</th>
                        <th>Период</th>
                        <th>Статус</th>
                        <th>Действие</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promoCodes.map((row) => (
                        <tr key={row.id}>
                          <td>{row.code}</td>
                          <td>{formatPromoDiscount(row)}</td>
                          <td>{row.maxUses ?? '—'}</td>
                          <td>{row.maxUsesPerNickname ?? '—'}</td>
                          <td>{row.usedCount}</td>
                          <td>
                            {formatDate(row.startsAt)}
                            <br />
                            {formatDate(row.endsAt)}
                          </td>
                          <td>{row.isActive ? 'active' : 'disabled'}</td>
                          <td>
                            <button
                              type="button"
                              className="xk-admin-link-button"
                              onClick={() => void handleTogglePromoActive(row)}
                            >
                              {row.isActive ? 'Отключить' : 'Включить'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
