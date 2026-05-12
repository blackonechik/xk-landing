import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card, Text } from '@heroui/react'
import { LogIn } from 'lucide-react'
import { fetchAccount, getDiscordLoginUrl } from '@/entities/account'
import { HeroLinkButton, HeroPage } from '@/shared/ui/hero-page'

export function LoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    let isActive = true

    void fetchAccount()
      .then(() => {
        if (!isActive) {
          return
        }

        void navigate({ to: '/cabinet' })
      })
      .catch(() => {
        if (!isActive) {
          return
        }
      })

    return () => {
      isActive = false
    }
  }, [navigate])

  return (
    <HeroPage
      eyebrow="Аккаунт"
      title="Авторизация"
      description="Войдите через Discord, чтобы открыть личный кабинет, банк и управление аккаунтом."
      narrow
    >
      <Card className="max-w-lg">
        <LogIn className="size-6 text-muted" />
        <Card.Header>
          <Card.Title>Вход на сайт</Card.Title>
          <Card.Description>
            Авторизация нужна для доступа к приватным разделам аккаунта.
          </Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col gap-4">
          <HeroLinkButton href={getDiscordLoginUrl()}>
            Вход через Discord
          </HeroLinkButton>
          <Text color="muted" type="body-sm">
            Продолжая вход, вы принимаете условия использования проекта.
          </Text>
        </Card.Content>
        <Card.Footer>
          <HeroLinkButton to="/offer" variant="ghost" size="sm">
            Условия использования
          </HeroLinkButton>
        </Card.Footer>
      </Card>
    </HeroPage>
  )
}
