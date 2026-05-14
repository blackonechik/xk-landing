import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { Alert, Button, Spinner } from '@heroui/react'
import {
  fetchAccountCached,
  getCachedAccount,
  logout,
  type AccountPayload,
} from '@/entities/account'
import { closeCard, createCard, transferDiamonds } from '@/entities/bank'
import { HeroLinkButton, HeroPage } from '@/shared/ui/hero-page'
import {
  BankCardsView,
  BankHistoryView,
  BankOnboarding,
  BankSummary,
  BankTransferView,
  type BankView,
} from '@/widgets/account/bank-cabinet'
import { AccountLayout } from '@/widgets/account/layout'

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
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const [account, setAccount] = useState<AccountPayload | null>(() =>
    getCachedAccount(),
  )
  const [error, setError] = useState('')
  const activeView = getBankViewFromPathname(pathname)

  async function loadAccount() {
    try {
      const payload = await fetchAccountCached()
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

  useEffect(() => {
    if (!account) {
      return
    }

    const hasBankCards = account.bank.cards.length > 0

    if (!hasBankCards && pathname !== '/cabinet/bank') {
      void navigate({ replace: true, to: '/cabinet/bank' })
      return
    }

    if (hasBankCards && pathname === '/cabinet/bank') {
      void navigate({ replace: true, to: '/cabinet/bank/cards' })
    }
  }, [account, navigate, pathname])

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
      <HeroPage
        eyebrow="XK Bank"
        title="Загружаем банк"
        description="Получаем карты, лимиты и историю операций."
        narrow
      >
        <Alert status="accent">
          <Alert.Indicator>
            <Spinner size="sm" />
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Title>Пожалуйста, подождите</Alert.Title>
          </Alert.Content>
        </Alert>
      </HeroPage>
    )
  }

  const hasCards = account.bank.cards.length > 0
  const canCreateCard =
    account.bank.cards.length < account.bank.limits.maxCardsPerPlayer

  return (
    <AccountLayout
      account={account}
      activeBankView={activeView}
      currentSection="bank"
      onNavigate={(to) => {
        void navigate({ to })
      }}
      onBankViewNavigate={(view) => {
        void navigate({ to: getBankViewPath(view) })
      }}
      eyebrow="XK Bank"
      title={hasCards ? 'Карты и переводы' : 'Добро пожаловать в банк!'}
      description={
        hasCards
          ? 'Управление картами, балансом, переводами и историей операций.'
          : 'Карты и переводы. Управление картами, балансом, переводами и историей операций.'
      }
      actions={
        <>
          <HeroLinkButton to="/cabinet" variant="secondary">
            Назад в профиль
          </HeroLinkButton>
          <Button
            variant="ghost"
            onPress={() => {
              void logout().then(() => navigate({ to: '/' }))
            }}
          >
            Выйти
          </Button>
        </>
      }
    >
      <div className="grid gap-6">
        {hasCards ? (
          <BankSummary account={account} totalDiamonds={totalDiamonds} />
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

        {error ? (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{error}</Alert.Title>
            </Alert.Content>
          </Alert>
        ) : null}
      </div>
    </AccountLayout>
  )
}

function getBankViewFromPathname(pathname: string): BankView {
  if (pathname.endsWith('/transfer')) {
    return 'transfer'
  }

  if (pathname.endsWith('/history')) {
    return 'history'
  }

  return 'cards'
}

function getBankViewPath(view: BankView) {
  return `/cabinet/bank/${view}` as
    | '/cabinet/bank/cards'
    | '/cabinet/bank/transfer'
    | '/cabinet/bank/history'
}
