import { useEffect, useState } from 'react'
import { Alert, Button, Spinner } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import {
  fetchAccountCached,
  getCachedAccount,
  type AccountPayload,
} from '@/entities/account'
import { AccountLayout } from '@/widgets/account/layout'
import { NewsPage } from './NewsPage'

export function CabinetNewsPage() {
  const navigate = useNavigate()
  const [account, setAccount] = useState<AccountPayload | null>(() =>
    getCachedAccount(),
  )

  useEffect(() => {
    let isActive = true

    void fetchAccountCached()
      .then((payload) => {
        if (isActive) {
          setAccount(payload)
        }
      })
      .catch(async (loadError) => {
        if (!isActive) {
          return
        }

        if (loadError instanceof Error && loadError.message === 'UNAUTHORIZED') {
          await navigate({ to: '/login' })
          return
        }

        setAccount(null)
      })

    return () => {
      isActive = false
    }
  }, [navigate])

  if (!account) {
    return (
      <main className="xk-hero-scope min-h-svh bg-background px-4 pb-16 pt-28 text-foreground">
        <div className="mx-auto max-w-3xl">
          <Alert status="accent">
            <Alert.Indicator>
              <Spinner size="sm" />
            </Alert.Indicator>
            <Alert.Content>
              <Alert.Title>Загружаем кабинет</Alert.Title>
            </Alert.Content>
          </Alert>
        </div>
      </main>
    )
  }

  return (
    <AccountLayout
      account={account}
      currentSection="news"
      onNavigate={(to) => {
        void navigate({ to })
      }}
      onBankViewNavigate={(view) => {
        void navigate({ to: `/cabinet/bank/${view}` })
      }}
      title="Посты"
      description="Лента сервера, объявления команды и последние публикации XK HARDCORE."
      actions={
        <Button
          variant="secondary"
          onPress={() => {
            void navigate({ to: '/cabinet/admin/posts' })
          }}
        >
          <Plus size={18} />
          Написать пост
        </Button>
      }
    >
      <NewsPage basePath="/cabinet/news" embedded />
    </AccountLayout>
  )
}
