import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Button, Spinner } from '@heroui/react'
import { fetchAccount, logout } from '@/entities/account'
import {
  ProfileCharacterPanel,
  ProfileStatusPanel,
} from '@/widgets/account/profile-cabinet'
import { AccountLayout } from '@/widgets/account/layout'
import { HeroLinkButton, HeroPage } from '@/shared/ui/hero-page'
import type { AccountPayload } from '@/entities/account'

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
      account?.bank.cards.reduce(
        (sum, card) => sum + card.balanceDiamonds,
        0,
      ) ?? 0,
    [account],
  )

  if (!account) {
    return (
      <HeroPage
        eyebrow="Аккаунт"
        title="Загружаем кабинет"
        description="Собираем данные профиля, банка и статуса игрока."
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

  return (
    <AccountLayout
      account={account}
      currentSection="home"
      onBankViewNavigate={(view) => {
        void navigate({
          to: '/cabinet/bank',
          hash: view,
        })
      }}
      eyebrow="Аккаунт"
      title="Личный кабинет"
      description="Личный кабинет активно разрабатывается. Если вы нашли ошибку или хотите предложить улучшение, пожалуйста, сообщите нам в Discord."
      actions={
        <>
          <HeroLinkButton to="/cabinet/bank" variant="secondary">
            Открыть банк
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
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.74fr)_minmax(0,1fr)]">
        <ProfileCharacterPanel account={account} />
        <ProfileStatusPanel account={account} totalDiamonds={totalDiamonds} />
      </div>

      {error ? (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{error}</Alert.Title>
          </Alert.Content>
        </Alert>
      ) : null}
    </AccountLayout>
  )
}
