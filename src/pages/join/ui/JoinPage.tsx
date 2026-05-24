import { useState } from 'react'
import { Alert, Button, Card, Chip, Input, Spinner, Text } from '@heroui/react'
import { createJoinApplication } from '@/entities/site'
import { HeroPage } from '@/shared/ui/hero-page'

const nicknamePattern = /^[A-Za-z0-9_]{3,16}$/
const telegramPattern = /^@?[A-Za-z0-9_]{5,32}$/

export function JoinPage() {
  const [nickname, setNickname] = useState('')
  const [contact, setContact] = useState('')
  const [telegram, setTelegram] = useState('')
  const [discord, setDiscord] = useState('')
  const [age, setAge] = useState('16')
  const [serverPlans, setServerPlans] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedNickname = nickname.trim()
    const normalizedContact = contact.trim()
    const normalizedTelegram = telegram.trim()
    const normalizedDiscord = discord.trim()
    const parsedAge = Number(age)
    const normalizedPlans = serverPlans.trim()

    if (!nicknamePattern.test(normalizedNickname)) {
      setError('Ник должен быть от 3 до 16 символов: латиница, цифры и подчёркивание.')
      return
    }

    if (normalizedContact.length < 3) {
      setError('Укажите контакт для связи.')
      return
    }

    if (!telegramPattern.test(normalizedTelegram)) {
      setError('Укажите корректный Telegram.')
      return
    }

    if (normalizedDiscord.length < 2) {
      setError('Укажите Discord.')
      return
    }

    if (!Number.isInteger(parsedAge) || parsedAge < 10 || parsedAge > 99) {
      setError('Укажите возраст от 10 до 99 лет.')
      return
    }

    if (normalizedPlans.length < 20) {
      setError('Расскажите подробнее, чем хотите заниматься на сервере.')
      return
    }

    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      await createJoinApplication({
        nickname: normalizedNickname,
        contact: normalizedContact,
        telegram: normalizedTelegram.startsWith('@')
          ? normalizedTelegram
          : `@${normalizedTelegram}`,
        discord: normalizedDiscord,
        age: parsedAge,
        serverPlans: normalizedPlans,
      })

      setSuccess('Заявка отправлена. Администрация свяжется с вами после рассмотрения.')
      setNickname('')
      setContact('')
      setTelegram('')
      setDiscord('')
      setAge('16')
      setServerPlans('')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось отправить заявку.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <HeroPage
      eyebrow="Вступление"
      title="Анкета на вступление"
      description="Оставьте базовую информацию о себе и коротко опишите, чем хотите заниматься на сервере."
      narrow
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <Card.Header>
            <Card.Title>Новая заявка</Card.Title>
            <Card.Description>Ответ нужен один раз. Чем подробнее планы, тем проще принять решение.</Card.Description>
          </Card.Header>
          <Card.Content>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <Input
                label="Ник"
                placeholder="Steve_2026"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
              />
              <Input
                label="Контакт для связи"
                placeholder="Email, Telegram или другой контакт"
                value={contact}
                onChange={(event) => setContact(event.target.value)}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Telegram"
                  placeholder="@Steve2026"
                  value={telegram}
                  onChange={(event) => setTelegram(event.target.value)}
                />
                <Input
                  label="Discord"
                  placeholder="Steve_2026"
                  value={discord}
                  onChange={(event) => setDiscord(event.target.value)}
                />
              </div>
              <Input
                label="Возраст"
                inputMode="numeric"
                placeholder="16"
                value={age}
                onChange={(event) => setAge(event.target.value)}
              />
              <label className="grid gap-2">
                <Text type="body-sm">Чем планируете заниматься на сервере</Text>
                <textarea
                  className="min-h-36 rounded-[calc(var(--radius-lg)-2px)] border border-default-200 bg-content1 px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                  placeholder="Например: развивать город, участвовать в политике, строить экономику, делать ивенты, вести сюжет..."
                  value={serverPlans}
                  onChange={(event) => setServerPlans(event.target.value)}
                />
              </label>

              {error ? (
                <Alert status="danger">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>{error}</Alert.Title>
                  </Alert.Content>
                </Alert>
              ) : null}

              {success ? (
                <Alert status="success">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>{success}</Alert.Title>
                  </Alert.Content>
                </Alert>
              ) : null}

              <Button color="primary" type="submit" isDisabled={isSubmitting}>
                {isSubmitting ? <Spinner color="current" size="sm" /> : 'Отправить заявку'}
              </Button>
            </form>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Что важно</Card.Title>
          </Card.Header>
          <Card.Content className="grid gap-3">
            <Chip variant="soft">Ник должен совпадать с игровым</Chip>
            <Text color="muted" type="body-sm">Контакт нужен, чтобы администрация могла быстро вернуться к заявке.</Text>
            <Text color="muted" type="body-sm">Telegram и Discord лучше указывать актуальные: там придёт ответ или уточнения.</Text>
            <Text color="muted" type="body-sm">В описании планов полезно указать интерес к RP, строительству, экономике, городам, ивентам или политике сервера.</Text>
          </Card.Content>
        </Card>
      </div>
    </HeroPage>
  )
}