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
  const [activeBankView, setActiveBankView] = useState<
    'cards' | 'transfer' | 'history'
  >('cards')
  const [recipientMode, setRecipientMode] = useState<'nickname' | 'card'>(
    'nickname',
  )
  const [cardTitle, setCardTitle] = useState('Алмазная карта')
  const [cardDesign, setCardDesign] = useState('creeper')
  const [transferForm, setTransferForm] = useState({
    fromCardId: '',
    toCardNumber: '',
    toOwnerNickname: '',
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
  const hasCards = account.bank.cards.length > 0
  const canCreateCard =
    account.bank.cards.length < account.bank.limits.maxCardsPerPlayer
  const recipientSuggestions = Array.from(
    new Set(
      account.bank.transfers
        .flatMap((transfer) => [transfer.fromOwner, transfer.toOwner])
        .filter((nickname) => nickname !== account.player.nickname),
    ),
  )
  const hasRecipient =
    recipientMode === 'nickname'
      ? Boolean(transferForm.toOwnerNickname.trim())
      : Boolean(transferForm.toCardNumber.trim())
  const canTransfer =
    Boolean(transferForm.fromCardId) &&
    hasRecipient &&
    Number(transferForm.amountDiamonds) >=
      account.bank.limits.minTransferDiamonds

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

        {hasCards ? (
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
        ) : null}

        {!hasCards ? (
          <section className="xk-bank-onboarding">
            <div className="xk-bank-onboarding__copy">
              <p className="xk-overline">Первый шаг</p>
              <h2>Выпустите карту</h2>
              <p>
                После выпуска откроются баланс, переводы и история операций. Имя
                владельца на карте берётся из вашего Minecraft-профиля.
              </p>
            </div>
            <section className="xk-bank-panel">
              <div className="xk-panel-heading">
                <div>
                  <p className="xk-overline">Новая карта</p>
                  <h2>Оформление</h2>
                </div>
                <Plus size={28} />
              </div>

              <div className="xk-card-create xk-card-create_onboarding">
                <div
                  className={`xk-bank-card xk-bank-card_preview xk-bank-card_${cardDesign}`}
                >
                  <div>
                    <CreditCard size={18} />
                    <span>{cardTitle || 'Алмазная карта'}</span>
                  </div>
                  <strong>4408 **** **** ****</strong>
                  <p>
                    {account.player.nickname} · {selectedDesign.title}
                  </p>
                </div>
                <label className="xk-bank-field">
                  <span>Имя владельца</span>
                  <input value={account.player.nickname} disabled />
                </label>
                <label className="xk-bank-field">
                  <span>Название карты</span>
                  <input
                    value={cardTitle}
                    onChange={(event) => setCardTitle(event.target.value)}
                  />
                </label>
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
                  disabled={!canCreateCard}
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
                  Выпустить карту
                </button>
              </div>
            </section>
          </section>
        ) : null}

        {hasCards ? (
          <div
            className="xk-bank-tabs"
            role="tablist"
            aria-label="Разделы банка"
          >
            {[
              { id: 'cards', label: 'Карты' },
              { id: 'transfer', label: 'Перевод' },
              { id: 'history', label: 'История' },
            ].map((tab) => (
              <button
                className={activeBankView === tab.id ? 'is-active' : ''}
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveBankView(tab.id as typeof activeBankView)
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : null}

        {hasCards && activeBankView === 'cards' ? (
          <div className="xk-bank-grid xk-bank-grid_single">
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
                    <p>
                      {account.player.nickname} · {selectedDesign.title}
                    </p>
                  </div>
                  <label className="xk-bank-field">
                    <span>Название карты</span>
                    <input
                      value={cardTitle}
                      onChange={(event) => setCardTitle(event.target.value)}
                    />
                  </label>
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
                    disabled={!canCreateCard}
                    onClick={async () => {
                      setError('')
                      try {
                        await createCard({
                          title: cardTitle,
                          design: cardDesign,
                        })
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
                        {card.ownerNickname} · {card.balanceDiamonds} алмазов ·{' '}
                        {cardDesigns.find((design) => design.id === card.design)
                          ?.title ?? 'Крипер'}
                      </p>
                    </article>
                  ))}
                  {account.bank.cards.length === 0 ? (
                    <p className="xk-muted">
                      Создай первую карту для переводов.
                    </p>
                  ) : null}
                </div>
              </section>
            </div>
          </div>
        ) : null}

        {hasCards && activeBankView === 'transfer' ? (
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
                      toOwnerNickname: '',
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
                  className="xk-transfer-form__wide"
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
                <div className="xk-transfer-recipient-mode">
                  <button
                    className={recipientMode === 'nickname' ? 'is-active' : ''}
                    type="button"
                    onClick={() => {
                      setRecipientMode('nickname')
                      setTransferForm((current) => ({
                        ...current,
                        toCardNumber: '',
                      }))
                    }}
                  >
                    По нику
                  </button>
                  <button
                    className={recipientMode === 'card' ? 'is-active' : ''}
                    type="button"
                    onClick={() => {
                      setRecipientMode('card')
                      setTransferForm((current) => ({
                        ...current,
                        toOwnerNickname: '',
                      }))
                    }}
                  >
                    По карте
                  </button>
                </div>
                {recipientMode === 'nickname' ? (
                  <>
                    <input
                      className="xk-transfer-form__wide"
                      list="xk-bank-recipient-nicks"
                      placeholder="Ник игрока"
                      value={transferForm.toOwnerNickname}
                      onChange={(event) =>
                        setTransferForm((current) => ({
                          ...current,
                          toOwnerNickname: event.target.value,
                        }))
                      }
                    />
                    <datalist id="xk-bank-recipient-nicks">
                      {recipientSuggestions.map((nickname) => (
                        <option key={nickname} value={nickname} />
                      ))}
                    </datalist>
                  </>
                ) : (
                  <input
                    className="xk-transfer-form__wide"
                    placeholder="Номер карты получателя"
                    value={transferForm.toCardNumber}
                    onChange={(event) =>
                      setTransferForm((current) => ({
                        ...current,
                        toCardNumber: event.target.value,
                      }))
                    }
                  />
                )}
                {hasRecipient ? (
                  <>
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
                  </>
                ) : null}
                <button type="submit" disabled={!canTransfer}>
                  <Send size={18} />
                  Перевести
                </button>
              </form>
            </section>
          </div>
        ) : null}

        {hasCards && activeBankView === 'history' ? (
          <div className="xk-bank-stack">
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
        ) : null}

        {error ? <div className="xk-cabinet-error">{error}</div> : null}
      </section>
    </main>
  )
}
