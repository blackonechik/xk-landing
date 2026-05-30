import { useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Checkbox,
  FieldError,
  Form,
  Input,
  Label,
  Radio,
  RadioGroup,
  TextField,
} from '@heroui/react'
import { ShieldCheck, WalletCards } from 'lucide-react'
import { createPayment } from '../model/api'
import { paymentProducts } from '../model/products'
import type { PaymentProductId } from '../model/products'
import AnimatedLink from '@/components/AnimatedLink'
import { PublicCabinetShell } from '@/shared/ui/public-cabinet-shell'

const nicknamePattern = /^[A-Za-z0-9_]{3,16}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const telegramPattern = /^@?[A-Za-z0-9_]{5,32}$/

function validateNickname(value: string) {
  if (!nicknamePattern.test(value.trim())) {
    return 'Ник должен быть от 3 до 16 символов: латиница, цифры и подчёркивание.'
  }

  return null
}

function validateEmail(value: string) {
  if (!emailPattern.test(value.trim())) {
    return 'Укажите корректную почту для связи с администратором.'
  }

  return null
}

function validateTelegram(value: string) {
  if (!telegramPattern.test(value.trim())) {
    return 'Укажите Telegram для связи с администратором.'
  }

  return null
}

export function PaymentPage() {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [telegram, setTelegram] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [productId, setProductId] = useState<PaymentProductId>('smp-pass')
  const [hasPersonalDataConsent, setHasPersonalDataConsent] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedProduct = useMemo(
    () =>
      paymentProducts.find((product) => product.id === productId) ??
      paymentProducts[0],
    [productId],
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedNickname = nickname.trim()
    const normalizedEmail = email.trim()
    const normalizedTelegram = telegram.trim()
    const normalizedPromoCode = promoCode.trim().toUpperCase()

    if (!nicknamePattern.test(normalizedNickname)) {
      setError('Ник должен быть от 3 до 16 символов: латиница, цифры и подчёркивание.')
      return
    }

    if (!emailPattern.test(normalizedEmail)) {
      setError('Укажите корректную почту для связи с администратором.')
      return
    }

    if (!telegramPattern.test(normalizedTelegram)) {
      setError('Укажите Telegram для связи с администратором.')
      return
    }

    if (!hasPersonalDataConsent) {
      setError('Подтвердите согласие на обработку персональных данных.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const payment = await createPayment({
        nickname: normalizedNickname,
        email: normalizedEmail,
        telegram: normalizedTelegram.startsWith('@')
          ? normalizedTelegram
          : `@${normalizedTelegram}`,
        productId,
        promoCode: normalizedPromoCode || undefined,
      })

      window.location.href = payment.confirmationUrl
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось создать оплату.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PublicCabinetShell eyebrow="Оплата" title="Проходка и RP-жизни">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card className="border border-separator bg-surface">
          <Card.Header className="p-6 pb-0">
            <Card.Title>Данные заказа</Card.Title>
          </Card.Header>
          <Card.Content className="p-6">
            <Form className="grid gap-5" id="xk-payment-form" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  className="grid gap-2"
                  isRequired
                  name="nickname"
                  validate={validateNickname}
                  value={nickname}
                  onChange={setNickname}
                >
                  <Label>Никнейм</Label>
                  <Input
                    aria-label="Никнейм"
                    autoComplete="nickname"
                    maxLength={16}
                    placeholder="Steve_2026"
                    variant="secondary"
                  />
                  <FieldError />
                </TextField>

                <TextField
                  className="grid gap-2"
                  isRequired
                  name="email"
                  type="email"
                  validate={validateEmail}
                  value={email}
                  onChange={setEmail}
                >
                  <Label>Электронная почта</Label>
                  <Input
                    aria-label="Электронная почта"
                    autoComplete="email"
                    placeholder="name@example.com"
                    variant="secondary"
                  />
                  <FieldError />
                </TextField>
              </div>

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
                    autoComplete="off"
                    placeholder="@Steve2026"
                    variant="secondary"
                  />
                  <FieldError />
                </TextField>

                <TextField
                  className="grid gap-2"
                  name="promoCode"
                  value={promoCode}
                  onChange={(value) => setPromoCode(value.toUpperCase())}
                >
                  <Label>Промокод</Label>
                  <Input
                    aria-label="Промокод"
                    autoComplete="off"
                    maxLength={32}
                    placeholder="WELCOME10"
                    variant="secondary"
                  />
                  <FieldError />
                </TextField>
              </div>

              <RadioGroup
                className="grid gap-3"
                name="productId"
                value={productId}
                onChange={(value) => setProductId(value as PaymentProductId)}
              >
                <Label>Услуга</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {paymentProducts.map((product) => (
                    <Radio
                      key={product.id}
                      className="rounded-3xl border border-separator bg-surface-secondary p-4 transition hover:border-border hover:bg-surface-tertiary data-[selected=true]:border-accent data-[selected=true]:bg-[color-mix(in_oklab,var(--accent)_12%,var(--surface))]"
                      value={product.id}
                    >
                      <Radio.Control className="mt-1">
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content className="grid min-w-0 gap-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 text-foreground">
                            {product.id === 'life' ? (
                              <ShieldCheck size={18} />
                            ) : (
                              <WalletCards size={18} />
                            )}
                            <span className="font-medium">{product.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {product.amountRub} руб.
                          </span>
                        </div>
                      </Radio.Content>
                    </Radio>
                  ))}
                </div>
                <FieldError />
              </RadioGroup>

              <Checkbox
                name="personalDataConsent"
                isSelected={hasPersonalDataConsent}
                onChange={setHasPersonalDataConsent}
              >
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <span className="text-sm leading-6 text-muted">
                    Я принимаю условия <AnimatedLink to="/offer">публичной оферты</AnimatedLink>, даю{' '}
                    <AnimatedLink to="/personal-data-consent">
                      согласие на обработку персональных данных
                    </AnimatedLink>{' '}
                    и ознакомлен с <AnimatedLink to="/privacy">политикой конфиденциальности</AnimatedLink>.
                  </span>
                </Checkbox.Content>
              </Checkbox>

              {error ? (
                <Alert status="danger">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>{error}</Alert.Title>
                  </Alert.Content>
                </Alert>
              ) : null}

              <Button
                className="w-full"
                isDisabled={isSubmitting}
                isPending={isSubmitting}
                type="submit"
                variant="primary"
              >
                {!isSubmitting ? 'Перейти к оплате' : null}
              </Button>
            </Form>
          </Card.Content>
        </Card>

        <Card className="border border-separator bg-surface-secondary xl:sticky xl:top-0 xl:self-start">
          <Card.Content className="grid gap-4 p-6">
            <div className="grid gap-3 rounded-3xl border border-separator bg-surface p-4">
              <div className="flex items-center justify-between gap-3 text-sm text-muted">
                <span>Товар</span>
                <strong className="text-right text-foreground">{selectedProduct.name}</strong>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm text-muted">
                <span>Стоимость</span>
                <strong className="text-foreground">{selectedProduct.amountRub} руб.</strong>
              </div>
              {promoCode.trim() ? (
                <div className="text-sm text-success">Промокод {promoCode.trim()}</div>
              ) : null}
            </div>
          </Card.Content>
        </Card>
      </div>
    </PublicCabinetShell>
  )
}
