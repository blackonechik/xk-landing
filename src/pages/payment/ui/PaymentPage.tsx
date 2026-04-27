import { useMemo, useState } from 'react'
import { createPayment } from '../model/api'
import { paymentProducts } from '../model/products'
import type { PaymentProductId } from '../model/products'
import { LandingButton } from '@/shared/ui/landing-button'
import { LandingCard } from '@/shared/ui/landing-card'
import { LandingSection } from '@/shared/ui/landing-section'

const nicknamePattern = /^[A-Za-z0-9_]{3,16}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const telegramPattern = /^@?[A-Za-z0-9_]{5,32}$/

function PaymentProductIcon({ productId }: { productId: PaymentProductId }) {
  const iconSrc =
    productId === 'life'
      ? '/assets/img/general/resized_32_heart.png'
      : '/assets/img/general/resized_32_written_book.png'

  if (productId === 'life') {
    return (
      <span className="xk-payment-product__icon" aria-hidden="true">
        <img src={iconSrc} alt="" />
      </span>
    )
  }

  return (
    <span className="xk-payment-product__icon" aria-hidden="true">
      <img src={iconSrc} alt="" />
    </span>
  )
}

export function PaymentPage() {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [telegram, setTelegram] = useState('')
  const [productId, setProductId] = useState<PaymentProductId>('smp-pass')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedProduct = useMemo(
    () => paymentProducts.find((product) => product.id === productId) ?? paymentProducts[0],
    [productId],
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedNickname = nickname.trim()
    const normalizedEmail = email.trim()
    const normalizedTelegram = telegram.trim()

    if (!nicknamePattern.test(normalizedNickname)) {
      setError('Ник должен быть от 3 до 16 символов: латиница, цифры и подчёркивание.')
      return
    }

    if (!emailPattern.test(normalizedEmail)) {
      setError('Укажите корректную почту, чтобы администратор мог связаться с вами.')
      return
    }

    if (!telegramPattern.test(normalizedTelegram)) {
      setError('Укажите Telegram username: от 5 до 32 символов, можно с @ в начале.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const payment = await createPayment({
        nickname: normalizedNickname,
        email: normalizedEmail,
        telegram: normalizedTelegram.startsWith('@') ? normalizedTelegram : `@${normalizedTelegram}`,
        productId,
      })

      window.location.href = payment.confirmationUrl
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось создать оплату.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="tycoon-landing xk-payment-page">
      <LandingSection
        id="payment"
        tone="brown"
        title="Оплата"
        mark="Проходка и RP-жизни"
        titleClassName="tycoon-color-yellow"
        markClassName="tycoon-color-orange-2"
        wrapperClassName="xk-payment-wrapper"
        withEffect
        withEnding
        withLine={false}
      >
        <div className="xk-payment-layout mt-10">
          <LandingCard title="Заказ" contentClassName="xk-payment-card" infoClassName="xk-payment-card__body">
            <form className="xk-payment-form" id="xk-payment-form" onSubmit={handleSubmit}>
              <label className="xk-payment-field">
                <span>Никнейм</span>
                <input
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  name="nickname"
                  autoComplete="nickname"
                  placeholder="Steve_2026"
                  maxLength={16}
                />
              </label>

              <div className="xk-payment-contact-grid">
                <label className="xk-payment-field">
                  <span>Email</span>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="player@example.com"
                    maxLength={120}
                  />
                </label>

                <label className="xk-payment-field">
                  <span>Telegram</span>
                  <input
                    value={telegram}
                    onChange={(event) => setTelegram(event.target.value)}
                    name="telegram"
                    autoComplete="username"
                    placeholder="@username"
                    maxLength={33}
                  />
                </label>
              </div>

              <div className="xk-payment-products" role="radiogroup" aria-label="Товар">
                {paymentProducts.map((product) => (
                  <label
                    key={product.id}
                    className={[
                      'xk-payment-product',
                      product.id === productId ? 'xk-payment-product_active' : undefined,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <input
                      type="radio"
                      name="product"
                      value={product.id}
                      checked={product.id === productId}
                      onChange={() => setProductId(product.id)}
                    />
                    <div className="xk-payment-product__head">
                      <PaymentProductIcon productId={product.id} />
                      <span className="xk-payment-product__name">{product.name}</span>
                    </div>
                    <span className="xk-payment-product__text">{product.description}</span>
                    <strong>{product.amountRub} руб.</strong>
                  </label>
                ))}
              </div>

              {error ? <p className="xk-payment-error">{error}</p> : null}
            </form>
          </LandingCard>

          <LandingCard
            title="Итого"
            tone="green"
            contentClassName="xk-payment-card"
            infoClassName="xk-payment-summary"
          >
            <div className="xk-payment-summary__row">
              <span>Товар</span>
              <strong className="xk-payment-summary__value">{selectedProduct.name}</strong>
            </div>
            <div className="xk-payment-summary__row">
              <span>Стоимость</span>
              <strong className="xk-payment-summary__value">{selectedProduct.amountRub} руб.</strong>
            </div>
              <p className="xk-payment-note">
                Нажимая кнопку, вы принимаете условия <a href="/offer">публичной оферты</a>.
              </p>
            <LandingButton
              as="button"
              type="submit"
              form="xk-payment-form"
              tone="success"
              className="xk-payment-summary__submit"
              contentClassName="xk-payment-summary__submit-content"
              disabled={isSubmitting}
              arrow
            >
              {isSubmitting ? 'Создаём оплату' : 'Перейти к оплате'}
            </LandingButton>
            <p>
              После оплаты администратор свяжется с вами по email или в Telegram,
              уточнит заявку и активирует цифровую услугу для указанного никнейма.
            </p>
            <p>
              Это не физический товар: доставка не требуется, получение заказа
              происходит через связь с администратором и активацию внутри сервера.
            </p>
          </LandingCard>
        </div>
      </LandingSection>
    </main>
  )
}
