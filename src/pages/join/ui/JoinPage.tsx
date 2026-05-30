import { useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Chip,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Spinner,
  Text,
  TextArea,
  TextField,
} from '@heroui/react'
import { createJoinApplication } from '@/entities/site'
import { HeroLinkButton } from '@/shared/ui/hero-page'
import { PublicCabinetShell } from '@/shared/ui/public-cabinet-shell'

const nicknamePattern = /^[A-Za-z0-9_]{3,16}$/
const telegramPattern = /^@?[A-Za-z0-9_]{5,32}$/

function validateNickname(value: string) {
  if (!nicknamePattern.test(value.trim())) {
    return 'Ник должен быть от 3 до 16 символов: латиница, цифры и подчёркивание.'
  }

  return null
}

function validateContact(value: string) {
  if (value.trim().length < 3) {
    return 'Укажите контакт для связи.'
  }

  return null
}

function validateTelegram(value: string) {
  if (!telegramPattern.test(value.trim())) {
    return 'Укажите корректный Telegram.'
  }

  return null
}

function validateDiscord(value: string) {
  if (value.trim().length < 2) {
    return 'Укажите Discord.'
  }

  return null
}

function validateAge(value: string) {
  const parsedAge = Number(value)

  if (!Number.isInteger(parsedAge) || parsedAge < 10 || parsedAge > 99) {
    return 'Укажите возраст от 10 до 99 лет.'
  }

  return null
}

function validateServerPlans(value: string) {
  if (value.trim().length < 20) {
    return 'Расскажите подробнее, чем хотите заниматься на сервере.'
  }

  return null
}

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
    <PublicCabinetShell
      eyebrow="Вступление"
      title="Анкета на вступление"
      description="Оставьте базовую информацию о себе и объёмно опишите, чем хотите заниматься на сервере. Чем понятнее ваши планы, тем проще команде принять решение."
      actions={
        <>
          <HeroLinkButton to="/rules" variant="secondary">
            Правила
          </HeroLinkButton>
          <HeroLinkButton to="/payment" variant="ghost">
            Оплата
          </HeroLinkButton>
        </>
      }
      aside={
        <Card className="overflow-hidden border border-white/12 bg-white/8 shadow-[0_24px_60px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
          <Card.Content className="grid gap-5 p-5">
            <div className="grid gap-2">
              <Chip color="accent" variant="soft">
                Что проверяем
              </Chip>
              <Text className="text-white" type="h3">
                Заявка должна объяснять вас, а не просто перечислять поля
              </Text>
              <Text className="text-white/68" type="body-sm">
                Контакты нужны для обратной связи, а блок с планами показывает, как вы видите себя в сезоне: строителем, политиком, торговцем, автором событий или лидером города.
              </Text>
            </div>

            <div className="grid gap-3">
              {[
                'Игровой ник должен совпадать с тем, под которым вы реально зайдёте на сервер.',
                'Контакт для связи нужен как резервный способ быстро вернуть вас к заявке.',
                'В описании планов лучше писать объёмно: какие цели, формат RP и роль в мире вам интересны.',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/14 p-4 text-sm leading-6 text-white/68">
                  {item}
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      }
    >

        <Card>
          <Card.Header className="grid gap-2 p-6 pb-0">
            <Card.Title>Новая заявка</Card.Title>
            <Card.Description>
              Ответ нужен один раз. Пишите развёрнуто: как хотите играть, что строить, в каких конфликтах или союзах себя видите.
            </Card.Description>
          </Card.Header>
          <Card.Content className="p-6">
            <Form className="grid gap-4" onSubmit={handleSubmit}>
              <TextField
                className="grid gap-2"
                isRequired
                name="nickname"
                validate={validateNickname}
                value={nickname}
                onChange={setNickname}
              >
                <Label>Игровой ник</Label>
                <Input
                  aria-label="Игровой ник"
                  placeholder="Steve_2026"
                  variant="secondary"
                />
                <Description>
                  Это ник, по которому команда сверяет вашу заявку и whitelist.
                </Description>
                <FieldError />
              </TextField>

              <TextField
                className="grid gap-2"
                isRequired
                name="contact"
                validate={validateContact}
                value={contact}
                onChange={setContact}
              >
                <Label>Контакт для связи</Label>
                <Input
                  aria-label="Контакт для связи"
                  placeholder="Email, Telegram или другой контакт"
                  variant="secondary"
                />
                <Description>
                  Резервный способ быстро вернуться к вашей анкете, если основной мессенджер недоступен.
                </Description>
                <FieldError />
              </TextField>

              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  className="grid gap-2"
                  isRequired
                  name="telegram"
                  validate={validateTelegram}
                  value={telegram}
                  onChange={setTelegram}
                >
                  <Label>Telegram</Label>
                  <Input
                    aria-label="Telegram"
                    placeholder="@Steve2026"
                    variant="secondary"
                  />
                  <Description>
                    Основной мессенджер для ответа или уточнений по заявке.
                  </Description>
                  <FieldError />
                </TextField>
                <TextField
                  className="grid gap-2"
                  isRequired
                  name="discord"
                  validate={validateDiscord}
                  value={discord}
                  onChange={setDiscord}
                >
                  <Label>Discord</Label>
                  <Input
                    aria-label="Discord"
                    placeholder="Steve_2026"
                    variant="secondary"
                  />
                  <Description>
                    Нужен для серверной коммуникации после одобрения и старта в сезоне.
                  </Description>
                  <FieldError />
                </TextField>
              </div>

              <TextField
                className="grid gap-2"
                isRequired
                name="age"
                validate={validateAge}
                value={age}
                onChange={setAge}
              >
                <Label>Возраст</Label>
                <Input
                  aria-label="Возраст"
                  inputMode="numeric"
                  placeholder="16"
                  variant="secondary"
                />
                <Description>
                  Помогает команде понять общий формат общения и ожидания от состава игроков.
                </Description>
                <FieldError />
              </TextField>

              <TextField
                className="grid gap-2"
                isRequired
                name="serverPlans"
                validate={validateServerPlans}
                value={serverPlans}
                onChange={setServerPlans}
              >
                <Label>Чем планируете заниматься на сервере</Label>
                <TextArea
                  aria-label="Чем планируете заниматься на сервере"
                  className="min-h-36"
                  placeholder="Например: хочу развивать город с торговым уклоном, вступать в союзы, участвовать в политике сезона, строить экономические механики, делать сюжетные события и договариваться с соседями..."
                  variant="secondary"
                />
                <Description>
                  Здесь лучше писать объёмно: идеи, интерес к RP, экономике, строительству, дипломатии и формату игры с другими участниками.
                </Description>
                <FieldError />
              </TextField>

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

              <Button isDisabled={isSubmitting} isPending={isSubmitting} type="submit" variant="primary">
                {!isSubmitting ? 'Отправить заявку' : null}
              </Button>
            </Form>
          </Card.Content>
        </Card>
    </PublicCabinetShell>
  )
}