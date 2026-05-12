import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button, Card, Link, Text } from '@heroui/react'
import { LogIn } from 'lucide-react'
import { fetchAccount, getDiscordLoginUrl } from '@/entities/account'

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
    <main className="xk-login-page xk-hero-scope">
      <section className="xk-login-shell page-wrap items-center">
        <Card className="xk-login-hero-card w-full max-w-lg">
          <LogIn className="mx-auto size-6" />
          <Card.Header className="items-center text-center">
            <Card.Title>Авторизация</Card.Title>
            <Card.Description>
              Войдите через Discord, чтобы открыть личный кабинет, банк и
              управление аккаунтом.
            </Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col items-center gap-4 text-center">
            <Button
              onClick={() => {
                window.location.href = getDiscordLoginUrl(window.location.origin)
              }}
            >
              Вход через Discord
            </Button>
            <Text type="body-sm" color="muted">
              Продолжая вход, вы принимаете
              <Link href="/offer">условия использования проекта  <Link.Icon /></Link>.
            </Text>
          </Card.Content>
        </Card>
      </section>
    </main>
  )
}
