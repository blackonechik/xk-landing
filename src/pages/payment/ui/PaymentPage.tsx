import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Radio,
  RadioGroup,
  TextField,
} from '@heroui/react'
import { BadgePercent, Check, Gem, ShieldCheck, WalletCards } from 'lucide-react'
import { createPayment, resolvePaymentPromoCode } from '../model/api'
import { paymentProducts } from '../model/products'
import type { PaymentProductId } from '../model/products'
import AnimatedLink from '@/components/AnimatedLink'
import { PublicCabinetShell } from '@/shared/ui/public-cabinet-shell'
import { HeroSectionCard } from '@/shared/ui/hero-page'

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

type AppliedPromo = {
  code: string
  nickname: string
  productId: PaymentProductId
  discountRub: number
  amountRub: number
}

export function PaymentPage() {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [telegram, setTelegram] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [productId, setProductId] = useState<PaymentProductId>('smp-pass')
  const [hasPersonalDataConsent, setHasPersonalDataConsent] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null)
  const [promoError, setPromoError] = useState('')
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const normalizedNickname = nickname.trim()
  const normalizedPromoCode = promoCode.trim().toUpperCase()

  const selectedProduct = useMemo(
    () =>
      paymentProducts.find((product) => product.id === productId) ??
      paymentProducts[0],
    [productId],
  )

  const activePromo = useMemo(() => {
    if (!appliedPromo) {
      return null
    }

    if (
      appliedPromo.code !== normalizedPromoCode ||
      appliedPromo.nickname !== normalizedNickname ||
      appliedPromo.productId !== productId
    ) {
      return null
    }

    return appliedPromo
  }, [appliedPromo, normalizedNickname, normalizedPromoCode, productId])

  useEffect(() => {
    if (appliedPromo && !activePromo) {
      setAppliedPromo(null)
    }
  }, [activePromo, appliedPromo])

  const finalAmountRub = activePromo?.amountRub ?? selectedProduct.amountRub
  const discountRub = activePromo?.discountRub ?? 0
  const isSubmitBlockedByPromo = Boolean(normalizedPromoCode) && !activePromo

  function clearPromoState() {
    setAppliedPromo(null)
    setPromoError('')
  }

  async function handleApplyPromo() {
    if (!normalizedPromoCode) {
      setAppliedPromo(null)
      setPromoError('Введите промокод.')
      return
    }

    if (!nicknamePattern.test(normalizedNickname)) {
      setAppliedPromo(null)
      setPromoError('Сначала укажите корректный никнейм.')
      return
    }

    setPromoError('')
    setError('')
    setIsApplyingPromo(true)

    try {
      const promo = await resolvePaymentPromoCode({
        nickname: normalizedNickname,
        productId,
        promoCode: normalizedPromoCode,
      })

      setPromoCode(promo.promoCode)
      setAppliedPromo({
        code: promo.promoCode,
        nickname: normalizedNickname,
        productId,
        discountRub: promo.discountRub,
        amountRub: promo.amountRub,
      })
    } catch (requestError) {
      setAppliedPromo(null)
      setPromoError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось проверить промокод.',
      )
    } finally {
      setIsApplyingPromo(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedEmail = email.trim()
    const normalizedTelegram = telegram.trim()

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

    if (normalizedPromoCode && !activePromo) {
      setError('Промокод нужно сначала проверить и применить.')
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
        promoCode: activePromo?.code || undefined,
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
    <PublicCabinetShell
      eyebrow="Оплата"
      title="Проходка и RP-жизни"
      description="Оформите доступ или дополнительную жизнь."
    >
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

                <TextField className="grid gap-2" name="promoCode" value={promoCode}>
                  <Label>Промокод</Label>
                  <div className="flex items-start gap-3">
                    <Input
                      aria-label="Промокод"
                      autoComplete="off"
                      className="flex-1"
                      maxLength={32}
                      placeholder="WELCOME10"
                      value={promoCode}
                      variant="secondary"
                      onChange={(event) => {
                        setPromoCode(event.target.value.toUpperCase())
                        clearPromoState()
                      }}
                    />
                    <Button
                      isDisabled={!normalizedPromoCode || isApplyingPromo}
                      isPending={isApplyingPromo}
                      type="button"
                      variant={activePromo ? 'secondary' : 'primary'}
                      onPress={() => void handleApplyPromo()}
                    >
                      {!isApplyingPromo ? (
                        activePromo ? (
                          <span className="inline-flex items-center gap-2">
                            <Check size={16} />
                            Применён
                          </span>
                        ) : (
                          'Применить'
                        )
                      ) : null}
                    </Button>
                  </div>
                  {activePromo ? (
                    <Description>
                      <span className="text-success">
                        Промокод применён. Скидка {activePromo.discountRub} руб., к оплате {activePromo.amountRub} руб.
                      </span>
                    </Description>
                  ) : promoError ? (
                    <Description>
                      <span className="text-danger">{promoError}</span>
                    </Description>
                      ) : null}
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
                isDisabled={isSubmitting || isApplyingPromo || isSubmitBlockedByPromo}
                isPending={isSubmitting}
                type="submit"
                variant="primary"
              >
                {!isSubmitting ? 'Перейти к оплате' : null}
              </Button>
            </Form>
          </Card.Content>
        </Card>

        <div className="grid gap-4 xl:sticky xl:top-[18px] xl:self-start">
          <HeroSectionCard
            gradient="sky"
            icon={<WalletCards size={36} />}
            label="Товар"
            value={selectedProduct.name}
          />
          <HeroSectionCard
            gradient="amber"
            icon={<Gem size={36} />}
            label="К оплате"
            value={`${finalAmountRub} руб.`}
          />
          {activePromo ? (
            <HeroSectionCard
              gradient="emerald"
              icon={<BadgePercent size={36} />}
              label="Скидка"
              value={`${discountRub} руб.`}
            />
          ) : null}
          {activePromo ? (
            <HeroSectionCard
              gradient="emerald"
              icon={<ShieldCheck size={36} />}
              label="Промокод"
              value={activePromo.code}
            />
          ) : null}
        </div>
      </div>
    </PublicCabinetShell>
  )
}
