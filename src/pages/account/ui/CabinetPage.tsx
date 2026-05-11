import { useEffect, useMemo, useState } from 'react'
import {
  CreditCard,
  Diamond,
  History,
  LogOut,
  Plus,
  Send,
  Shield,
  Signal,
  Swords,
  Trash2,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import {
  closeCard,
  createCard,
  fetchAccount,
  logout,
  transferDiamonds,
  type AccountPayload,
} from '../model/api'
import { SkinViewer } from './SkinViewer'

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

      setError('Не получилось загрузить кабинет.')
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
      <main className="xk-cabinet-page">
        <section className="page-wrap xk-cabinet-loading">
          Загружаем кабинет...
        </section>
      </main>
    )
  }

  const skinUuid = account.player.premiumUuid ?? account.player.uuid

  return (
    <main className="xk-cabinet-page">
      <section className="page-wrap xk-cabinet-hero">
        <div className="xk-cabinet-profile">
          <p className="xk-overline">Игровой профиль</p>
          <h1>{account.player.nickname}</h1>
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

        <div className="xk-bank-panel">
          <div className="xk-panel-heading">
            <div>
              <p className="xk-overline">XK Bank</p>
              <h2>{totalDiamonds} алмазов</h2>
              <span className="xk-bank-limit">
                Карты {account.bank.cards.length}/
                {account.bank.limits.maxCardsPerPlayer} · перевод до{' '}
                {account.bank.limits.maxTransferDiamonds} алм.
              </span>
            </div>
            <Diamond size={30} />
          </div>

          <div className="xk-card-create">
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
                  setError(errorMessages[message] ?? 'Не получилось создать карту.')
                }
              }}
            >
              <Plus size={18} />
            </button>
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
                setError(errorMessages[message] ?? 'Не получилось выполнить перевод.')
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
          {error ? <div className="xk-login-error">{error}</div> : null}
        </div>

        <div className="xk-stat-panel">
          <div className="xk-panel-heading">
            <div>
              <p className="xk-overline">Статистика</p>
              <h2>Заготовка</h2>
            </div>
            <History size={28} />
          </div>
          <div className="xk-stat-grid">
            <span>Убийства</span>
            <strong>скоро</strong>
            <span>Смерти</span>
            <strong>скоро</strong>
            <span>Время игры</span>
            <strong>скоро</strong>
          </div>
        </div>

        <div className="xk-history-panel">
          <div className="xk-panel-heading">
            <div>
              <p className="xk-overline">Переводы</p>
              <h2>История банка</h2>
            </div>
          </div>
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
    </main>
  )
}
