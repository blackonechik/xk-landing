import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Button, Card, Form, Input, Link, Text } from '@heroui/react'
import { LogIn } from 'lucide-react'
import {
  fetchAccountCached,
  loginWithPassword,
} from '@/entities/account'

export function LoginPage() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isActive = true

    void fetchAccountCached()
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedNickname = nickname.trim()

    if (!normalizedNickname || !password) {
      setError('Укажите ник и пароль.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await loginWithPassword({
        nickname: normalizedNickname,
        password,
      })

      await navigate({ to: '/cabinet' })
    } catch (authError) {
      if (authError instanceof Error) {
        if (authError.message === 'PLAYER_NOT_FOUND') {
          setError('Игрок с таким ником не найден.')
        } else if (authError.message === 'ACCOUNT_BLOCKED') {
          setError('Аккаунт заблокирован.')
        } else {
          setError('Неверный ник или пароль.')
        }
      } else {
        setError('Не удалось войти. Попробуйте еще раз.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="xk-login-page xk-hero-scope">
      <section className="xk-login-shell page-wrap items-center">
        <Card className="xk-login-hero-card w-full max-w-lg">
          <LogIn className="mx-auto size-6" />
          <Card.Header className="items-center text-center">
            <Card.Title>Авторизация</Card.Title>
            <Card.Description>
              Войдите по нику и паролю, чтобы открыть личный кабинет, банк и
              управление аккаунтом.
            </Card.Description>
          </Card.Header>
          <Card.Content className="grid gap-4 text-left">
            <Form className="grid gap-4" onSubmit={handleSubmit}>
              <Input
                autoComplete="username"
                className="w-full"
                label="Ник"
                maxLength={16}
                name="nickname"
                placeholder="Введите ник"
                value={nickname}
                variant="secondary"
                onChange={(event) => setNickname(event.target.value)}
              />
              <Input
                autoComplete="current-password"
                className="w-full"
                label="Пароль"
                name="password"
                placeholder="Введите пароль"
                type="password"
                value={password}
                variant="secondary"
                onChange={(event) => setPassword(event.target.value)}
              />
              {error ? (
                <Alert status="danger">
                  <Alert.Content>
                    <Alert.Title>{error}</Alert.Title>
                  </Alert.Content>
                </Alert>
              ) : null}
              <Button className="w-full" isLoading={isSubmitting} type="submit">
                Войти
              </Button>
            </Form>
            <Text type="body-sm" color="muted">
              Продолжая вход, вы принимаете
              <Link href="/offer">
                условия использования проекта <Link.Icon />
              </Link>
              .
            </Text>
          </Card.Content>
        </Card>
      </section>
    </main>
  )
}
