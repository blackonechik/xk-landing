import { useEffect, useMemo, useState } from 'react'
import { CreditCard, Diamond, History, Plus, Send, Trash2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import {
  closeCard,
  createCard,
  fetchAccount,
  logout,
  transferDiamonds,
  type AccountPayload,
} from '../model/api'
import { LandingButton } from '@/shared/ui/landing-button'

const cardDesigns = [
  { id: 'creeper', title: 'Крипер', mark: 'CR' },
  { id: 'panda', title: 'Панда', mark: 'PA' },
  { id: 'warden', title: 'Варден', mark: 'WA' },
  { id: 'enderman', title: 'Эндермен', mark: 'EN' },
  { id: 'fox', title: 'Лиса', mark: 'FX' },
  { id: 'bee', title: 'Пчела', mark: 'BE' },
  { id: 'axolotl', title: 'Аксолотль', mark: 'AX' },
  { id: 'skeleton', title: 'Скелет', mark: 'SK' },
]

const errorMessages: Record<string, string> = {
  CARD_LIMIT_REACHED: 'Достигнут лимит карт.',
  CARD_HAS_BALANCE: 'Сначала переведи алмазы с этой карты.',
  CARD_NOT_FOUND: 'Карта не найдена.',
  INVALID_AMOUNT: 'Укажи корректную сумму перевода.',
  TRANSFER_LIMIT_EXCEEDED: 'Сумма выше лимита одного перевода.',
  DAILY_LIMIT_EXCEEDED: 'Дневной лимит переводов исчерпан.',
  INSUFFICIENT_FUNDS: 'Недостаточно алмазов на карте.',
}

export function CabinetBankPage() {
  const navigate = useNavigate()
  const [account, setAccount] = useState<AccountPayload | null>(null)
  const [error, setError] = useState('')
  const [cardTitle, setCardTitle] = useState('Алмазная карта')
  const [cardDesign, setCardDesign] = useState('creeper')
  const [transferForm, setTransferForm] = useState({
    fromCardId: '',
    toCardNumber: '',
    amountDiamonds: '',
    comment: '',
  })

  async function loadAccount() {
    try {
      const payload = await fetchAccount()
      setAccount(payload)
      setTransferForm((current) => ({
        ...current,
        fromCardId: current.fromCardId || payload.bank.cards[0]?.id || '',
      }))
    } catch (loadError) {
      if (loadError instanceof Error && loadError.message === 'UNAUTHORIZED') {
        await navigate({ to: '/login' })
        return
      }

      setError('Не получилось загрузить банк.')
    }
  }

  useEffect(() => {
    void loadAccount()
  }, [])

  const totalDiamonds = useMemo(
    () =>
      account?.bank.cards.reduce(
        (sum, card) => sum + card.balanceDiamonds,
        0,
      ) ?? 0,
    [account],
  )

  if (!account) {
    return (
      <main className="xk-bank-page">
        <section className="page-wrap xk-bank-loading">
          Загружаем XK Bank...
        </section>
      </main>
    )
  }

  const selectedDesign =
    cardDesigns.find((design) => design.id === cardDesign) ?? cardDesigns[0]

  return (
    <main className="xk-bank-page">
      <section className="page-wrap xk-bank-shell">
        <div className="xk-bank-hero">
          <div>
            <p className="xk-overline">XK Bank</p>
            <h1>Карты и переводы</h1>
            <p className="xk-bank-lead">
              Отдельная страница для управления картами, переводами и историей
              операций.
            </p>
            <div className="xk-bank-actions">
              <LandingButton
                href="/cabinet"
                tone="primary"
                arrow
                className="xk-cabinet-cta xk-cabinet-cta_small"
              >
                Назад в профиль
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
            Выйти
          </button>
        </div>

        <div className="xk-bank-summary">
          <div className="xk-bank-summary__item">
            <Diamond size={22} />
            <div>
              <span>Баланс на картах</span>
              <strong>{totalDiamonds} алмазов</strong>
            </div>
          </div>
          <div className="xk-bank-summary__item">
            <CreditCard size={22} />
            <div>
              <span>Карты</span>
              <strong>
                {account.bank.cards.length}/
                {account.bank.limits.maxCardsPerPlayer}
              </strong>
            </div>
          </div>
          <div className="xk-bank-summary__item">
            <Send size={22} />
            <div>
              <span>Перевод за раз</span>
              <strong>{account.bank.limits.maxTransferDiamonds} алм.</strong>
            </div>
          </div>
          <div className="xk-bank-summary__item">
            <History size={22} />
            <div>
              <span>Дневной лимит</span>
              <strong>
                {account.bank.limits.dailyTransferDiamondsLimit} алм.
              </strong>
            </div>
          </div>
        </div>

        <div className="xk-bank-grid">
          <div className="xk-bank-stack">
            <section className="xk-bank-panel">
              <div className="xk-panel-heading">
                <div>
                  <p className="xk-overline">Новая карта</p>
                  <h2>Выпуск карты</h2>
                </div>
                <Plus size={28} />
              </div>

              <div className="xk-card-create">
                <div
                  className={`xk-bank-card xk-bank-card_preview xk-bank-card_${cardDesign}`}
                >
                  <div>
                    <CreditCard size={18} />
                    <span>{cardTitle || 'Алмазная карта'}</span>
                  </div>
                  <strong>4408 **** **** ****</strong>
                  <p>{selectedDesign.title}</p>
                </div>
                <input
                  value={cardTitle}
                  onChange={(event) => setCardTitle(event.target.value)}
                />
                <div className="xk-card-designs" aria-label="Дизайн карты">
                  {cardDesigns.map((design) => (
                    <button
                      className={cardDesign === design.id ? 'is-active' : ''}
                      key={design.id}
                      type="button"
                      title={design.title}
                      onClick={() => setCardDesign(design.id)}
                    >
                      {design.mark}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setError('')
                    try {
                      await createCard({ title: cardTitle, design: cardDesign })
                      await loadAccount()
                    } catch (createError) {
                      const message =
                        createError instanceof Error
                          ? createError.message
                          : 'CARD_CREATE_FAILED'
                      setError(
                        errorMessages[message] ??
                          'Не получилось создать карту.',
                      )
                    }
                  }}
                >
                  <Plus size={18} />
                </button>
              </div>
            </section>

            <section className="xk-bank-panel">
              <div className="xk-panel-heading">
                <div>
                  <p className="xk-overline">Мои карты</p>
                  <h2>Портфель карт</h2>
                </div>
                <CreditCard size={28} />
              </div>

              <div className="xk-bank-cards">
                {account.bank.cards.map((card) => (
                  <article
                    className={`xk-bank-card xk-bank-card_${card.design}`}
                    key={card.id}
                  >
                    <div>
                      <CreditCard size={18} />
                      <span>{card.title}</span>
                      <button
                        className="xk-bank-card__close"
                        type="button"
                        title="Закрыть карту"
                        onClick={async () => {
                          setError('')
                          try {
                            await closeCard(card.id)
                            await loadAccount()
                          } catch (closeError) {
                            const message =
                              closeError instanceof Error
                                ? closeError.message
                                : 'CARD_CLOSE_FAILED'
                            setError(
                              errorMessages[message] ??
                                'Не получилось закрыть карту.',
                            )
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <strong>{card.cardNumber}</strong>
                    <p>
                      {card.balanceDiamonds} алмазов ·{' '}
                      {cardDesigns.find((design) => design.id === card.design)
                        ?.title ?? 'Крипер'}
                    </p>
                  </article>
                ))}
                {account.bank.cards.length === 0 ? (
                  <p className="xk-muted">Создай первую карту для переводов.</p>
                ) : null}
              </div>
            </section>
          </div>

          <div className="xk-bank-stack">
            <section className="xk-bank-panel">
              <div className="xk-panel-heading">
                <div>
                  <p className="xk-overline">Перевод</p>
                  <h2>Отправить алмазы</h2>
                </div>
                <Send size={28} />
              </div>

              <form
                className="xk-transfer-form"
                onSubmit={async (event) => {
                  event.preventDefault()
                  setError('')
                  try {
                    await transferDiamonds(transferForm)
                    await loadAccount()
                    setTransferForm((current) => ({
                      ...current,
                      toCardNumber: '',
                      amountDiamonds: '',
                      comment: '',
                    }))
                  } catch (transferError) {
                    const message =
                      transferError instanceof Error
                        ? transferError.message
                        : 'TRANSFER_FAILED'
                    setError(
                      errorMessages[message] ??
                        'Не получилось выполнить перевод.',
                    )
                  }
                }}
              >
                <select
                  value={transferForm.fromCardId}
                  onChange={(event) =>
                    setTransferForm((current) => ({
                      ...current,
                      fromCardId: event.target.value,
                    }))
                  }
                >
                  {account.bank.cards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.title} · {card.cardNumber}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Карта получателя"
                  value={transferForm.toCardNumber}
                  onChange={(event) =>
                    setTransferForm((current) => ({
                      ...current,
                      toCardNumber: event.target.value,
                    }))
                  }
                />
                <input
                  inputMode="numeric"
                  placeholder="Алмазы"
                  value={transferForm.amountDiamonds}
                  onChange={(event) =>
                    setTransferForm((current) => ({
                      ...current,
                      amountDiamonds: event.target.value,
                    }))
                  }
                />
                <input
                  placeholder="Комментарий"
                  value={transferForm.comment}
                  onChange={(event) =>
                    setTransferForm((current) => ({
                      ...current,
                      comment: event.target.value,
                    }))
                  }
                />
                <button type="submit">
                  <Send size={18} />
                  Перевести
                </button>
              </form>
            </section>

            <section className="xk-bank-panel">
              <div className="xk-panel-heading">
                <div>
                  <p className="xk-overline">История</p>
                  <h2>Последние переводы</h2>
                </div>
                <History size={28} />
              </div>

              <div className="xk-history-list">
                {account.bank.transfers.map((transfer) => (
                  <div className="xk-transfer-row" key={transfer.id}>
                    <span>
                      {transfer.fromOwner} → {transfer.toOwner}
                    </span>
                    <strong>{transfer.amountDiamonds} алм.</strong>
                  </div>
                ))}
                {account.bank.transfers.length === 0 ? (
                  <p className="xk-muted">Пока нет переводов.</p>
                ) : null}
              </div>
            </section>
          </div>
        </div>

        {error ? <div className="xk-cabinet-error">{error}</div> : null}
      </section>
    </main>
  )
}
