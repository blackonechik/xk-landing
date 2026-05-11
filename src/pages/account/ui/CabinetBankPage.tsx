import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { fetchAccount, logout, type AccountPayload } from '@/entities/account'
import { closeCard, createCard, transferDiamonds } from '@/entities/bank'
import { LogoutButton } from '@/features/auth/logout'
import { LandingButton } from '@/shared/ui/landing-button'
import {
  BankCardsView,
  BankHistoryView,
  BankOnboarding,
  BankSummary,
  BankTabs,
  BankTransferView,
  type BankView,
} from '@/widgets/account/bank-cabinet'

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
  const [activeView, setActiveView] = useState<BankView>('cards')

  async function loadAccount() {
    try {
      const payload = await fetchAccount()
      setAccount(payload)
    } catch (loadError) {
      if (loadError instanceof Error && loadError.message === 'UNAUTHORIZED') {
        await navigate({ to: '/login' })
        return
      }

      setError('Не получилось загрузить банк.')
    }
  }

  async function runBankAction(
    action: () => Promise<void>,
    fallbackMessage: string,
  ) {
    setError('')

    try {
      await action()
      await loadAccount()
    } catch (actionError) {
      const message =
        actionError instanceof Error ? actionError.message : fallbackMessage
      setError(errorMessages[message] ?? fallbackMessage)
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

  const hasCards = account.bank.cards.length > 0
  const canCreateCard =
    account.bank.cards.length < account.bank.limits.maxCardsPerPlayer

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

          <LogoutButton
            onLogout={async () => {
              await logout()
              await navigate({ to: '/' })
            }}
          />
        </div>

        {hasCards ? (
          <>
            <BankSummary account={account} totalDiamonds={totalDiamonds} />
            <BankTabs activeView={activeView} onChange={setActiveView} />
          </>
        ) : (
          <BankOnboarding
            account={account}
            canCreateCard={canCreateCard}
            onCreateCard={(payload) =>
              runBankAction(
                () => createCard(payload),
                'Не получилось создать карту.',
              )
            }
          />
        )}

        {hasCards && activeView === 'cards' ? (
          <BankCardsView
            account={account}
            canCreateCard={canCreateCard}
            onCreateCard={(payload) =>
              runBankAction(
                () => createCard(payload),
                'Не получилось создать карту.',
              )
            }
            onCloseCard={(cardId) =>
              runBankAction(
                () => closeCard(cardId),
                'Не получилось закрыть карту.',
              )
            }
          />
        ) : null}

        {hasCards && activeView === 'transfer' ? (
          <BankTransferView
            account={account}
            onTransfer={(payload) =>
              runBankAction(
                () => transferDiamonds(payload),
                'Не получилось выполнить перевод.',
              )
            }
          />
        ) : null}

        {hasCards && activeView === 'history' ? (
          <BankHistoryView transfers={account.bank.transfers} />
        ) : null}

        {error ? <div className="xk-cabinet-error">{error}</div> : null}
      </section>
    </main>
  )
}
