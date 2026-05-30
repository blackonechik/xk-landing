import { useMemo, useState } from 'react'
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
  TextArea,
  Text,
} from '@heroui/react'
import { Check, ShieldCheck, TicketPercent, WalletCards } from 'lucide-react'
import { createPayment } from '../model/api'
import { paymentProducts } from '../model/products'
import type { PaymentProductId } from '../model/products'
import AnimatedLink from '@/components/AnimatedLink'
import { HeroLinkButton } from '@/shared/ui/hero-page'
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
      setError(
        'Ник должен быть от 3 до 16 символов: латиница, цифры и подчёркивание.',
      )
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
    <PublicCabinetShell
      eyebrow="Оплата"
      title="Проходка и RP-жизни"
      description="Публичная витрина теперь оформлена в том же визуальном слое, что и кабинет: чистые поверхности, понятная форма и фиксированный блок с итогом заказа."
      actions={
        <>
          <HeroLinkButton to="/offer" variant="secondary">
            Оферта
          </HeroLinkButton>
          <HeroLinkButton to="/privacy" variant="ghost">
            Конфиденциальность
          </HeroLinkButton>
        </>
      }
      aside={
        <Card className="overflow-hidden border border-white/12 bg-white/8 shadow-[0_24px_60px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
          <Card.Content className="grid gap-5 p-5">
            <div className="grid gap-2">
              <Text className="text-white" type="h3">
                Итого по заказу
              </Text>
              <Text className="text-white/68" type="body-sm">
                Выберите цифровую услугу, проверьте контакты и подтвердите документы перед переходом в ЮKassa.
              </Text>
            </div>

            <div className="grid gap-3 rounded-3xl border border-white/10 bg-black/18 p-4">
              <div className="flex items-center justify-between gap-3 text-sm text-white/68">
                <span>Товар</span>
                <strong className="text-right text-white">{selectedProduct.name}</strong>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm text-white/68">
                <span>Стоимость</span>
                <strong className="text-white">{selectedProduct.amountRub} руб.</strong>
              </div>
              {promoCode.trim() ? (
                <div className="flex items-start gap-2 text-sm text-emerald-200">
                  <TicketPercent className="mt-0.5 shrink-0" size={16} />
                  <span>Промокод {promoCode.trim()} будет проверен при создании платежа.</span>
                </div>
              ) : null}
            </div>

            <div className="grid gap-3">
              {[
                'Автоматическая переадресация на оплату после валидации формы.',
                'Активация услуги происходит для указанного никнейма.',
                'Физическая доставка не требуется: это цифровой продукт.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm leading-6 text-white/68">
                  <Check className="mt-1 shrink-0 text-emerald-300" size={16} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              form="xk-payment-form"
              isDisabled={isSubmitting}
              isPending={isSubmitting}
              type="submit"
              variant="primary"
            >
              {!isSubmitting ? 'Перейти к оплате' : null}
            </Button>
          </Card.Content>
        </Card>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="border border-white/12 bg-white/8 backdrop-blur-xl xl:col-span-1">
          <Card.Header className="grid gap-2 p-6 pb-0">
            <Card.Title className="text-white">Данные заказа</Card.Title>
            <Card.Description className="text-white/68">
              Укажите игровой ник, рабочие контакты и выберите услугу. Эти данные нужны для связи и корректной активации после успешной оплаты.
            </Card.Description>
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
                    autoComplete="nickname"
                    aria-label="Никнейм"
                    maxLength={16}
                    placeholder="Steve_2026"
                    variant="secondary"
                  />
                  <Description>
                    На этот ник будет выдан доступ или дополнительная жизнь.
                  </Description>
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
                    autoComplete="email"
                    aria-label="Электронная почта"
                    placeholder="name@example.com"
                    variant="secondary"
                  />
                  <Description>
                    Нужна для связи с администратором по платёжному вопросу.
                  </Description>
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
                    autoComplete="off"
                    aria-label="Telegram"
                    placeholder="@Steve2026"
                    variant="secondary"
                  />
                  <Description>
                    Основной канал связи для уточнений по покупке.
                  </Description>
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
                    autoComplete="off"
                    aria-label="Промокод"
                    maxLength={32}
                    placeholder="WELCOME10"
                    variant="secondary"
                  />
                  <Description>
                    Необязательное поле. Скидка проверяется на стороне сервера.
                  </Description>
                  <FieldError />
                </TextField>
              </div>

              <RadioGroup
                className="grid gap-3"
                name="productId"
                value={productId}
                onChange={(value) => setProductId(value as PaymentProductId)}
              >
                <Label>Выберите услугу</Label>
                <Description>
                  HeroUI-поле выбора товара: стоимость и тип услуги обновляют итоговый блок справа.
                </Description>
                <div className="grid gap-3 md:grid-cols-2">
                  {paymentProducts.map((product) => (
                    <Radio
                      key={product.id}
                      className="rounded-3xl border border-white/10 bg-black/14 p-4 transition hover:border-white/25 hover:bg-white/10 data-[selected=true]:border-rose-300/70 data-[selected=true]:bg-rose-400/14 data-[selected=true]:shadow-[0_18px_40px_rgba(244,114,182,0.18)]"
                      value={product.id}
                    >
                      <Radio.Control className="mt-1">
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content className="grid min-w-0 gap-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 text-white">
                            {product.id === 'life' ? (
                              <ShieldCheck size={18} />
                            ) : (
                              <WalletCards size={18} />
                            )}
                            <span className="font-medium">{product.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-white/90">
                            {product.amountRub} руб.
                          </span>
                        </div>
                        <span className="text-sm leading-6 text-white/68">
                          {product.description}
                        </span>
                      </Radio.Content>
                    </Radio>
                  ))}
                </div>
                <FieldError />
              </RadioGroup>

              <TextField className="grid gap-2" name="paymentComment">
                <Label>Комментарий к заказу</Label>
                <TextArea
                  aria-label="Комментарий к заказу"
                  className="min-h-24"
                  placeholder="Необязательно: например, если покупка связана с конкретной ситуацией на сервере."
                  variant="secondary"
                />
                <Description>
                  Поле необязательное. Если комментарий не нужен, оставьте пустым.
                </Description>
                <FieldError />
              </TextField>

              <Checkbox
                name="personalDataConsent"
                isSelected={hasPersonalDataConsent}
                onChange={setHasPersonalDataConsent}
              >
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <span className="text-sm leading-6 text-white/72">
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

              <div className="flex flex-wrap gap-3 xl:hidden">
                <Button isDisabled={isSubmitting} isPending={isSubmitting} type="submit" variant="primary">
                  {!isSubmitting ? 'Перейти к оплате' : null}
                </Button>
                <HeroLinkButton to="/join" variant="secondary">
                  Сначала подать заявку
                </HeroLinkButton>
              </div>
            </Form>
          </Card.Content>
        </Card>

        <Card className="border border-white/12 bg-white/8 backdrop-blur-xl">
          <Card.Content className="grid gap-5 p-6">
            <div className="grid gap-2">
              <Text className="text-white" type="h3">
                Перед оплатой
              </Text>
              <Text className="text-white/68" type="body-sm">
                Проверьте соответствие никнейма и убедитесь, что используете актуальные контакты для связи.
              </Text>
            </div>

            {[
              'Проходка открывает доступ к приватному серверу после успешной оплаты.',
              'Дополнительная жизнь подходит только для активного сезона и обрабатывается как цифровая услуга.',
              'Если промокод неверный, платёж не будет создан и форма вернёт ошибку.',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/14 p-4 text-sm leading-6 text-white/68">
                {item}
              </div>
            ))}
          </Card.Content>
        </Card>
      </div>
    </PublicCabinetShell>
  )
}
