import { useMemo, useState } from 'react'
import { createPayment } from '../model/api'
import { paymentProducts } from '../model/products'
import type { PaymentProductId } from '../model/products'
import { LandingButton } from '@/shared/ui/landing-button'
import { LandingCard } from '@/shared/ui/landing-card'
import { LandingSection } from '@/shared/ui/landing-section'

const nicknamePattern = /^[A-Za-z0-9_]{3,16}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function PaymentProductIcon({ productId }: { productId: PaymentProductId }) {
  const iconSrc =
    productId === 'life'
      ? '/assets/img/general/resized_32_heart.png'
      : '/assets/img/general/resized_32_written_book.png'

  return (
    <span className="xk-payment-product__icon" aria-hidden="true">
      <img src={iconSrc} alt="" />
    </span>
  )
}

export function PaymentPage() {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
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
          <LandingCard
            title="Заказ"
            contentClassName="xk-payment-card"
            infoClassName="xk-payment-card__body"
          >
            <form
              className="xk-payment-form"
              id="xk-payment-form"
              onSubmit={handleSubmit}
            >
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

              <label className="xk-payment-field">
                <span>Электронная почта</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  name="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                />
              </label>

              <label className="xk-payment-field">
                <span>Промокод</span>
                <input
                  value={promoCode}
                  onChange={(event) =>
                    setPromoCode(event.target.value.toUpperCase())
                  }
                  name="promoCode"
                  autoComplete="off"
                  placeholder="WELCOME10"
                  maxLength={32}
                />
              </label>

              <div
                className="xk-payment-products"
                role="radiogroup"
                aria-label="Товар"
              >
                {paymentProducts.map((product) => (
                  <label
                    key={product.id}
                    className={[
                      'xk-payment-product',
                      product.id === productId
                        ? 'xk-payment-product_active'
                        : undefined,
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
                      <span className="xk-payment-product__name">
                        {product.name}
                      </span>
                    </div>
                    <span className="xk-payment-product__text">
                      {product.description}
                    </span>
                    <strong>{product.amountRub} руб.</strong>
                  </label>
                ))}
              </div>

              <label className="xk-payment-consent">
                <input
                  type="checkbox"
                  checked={hasPersonalDataConsent}
                  onChange={(event) =>
                    setHasPersonalDataConsent(event.target.checked)
                  }
                  required
                />
                <span>
                  Я принимаю условия <a href="/offer">публичной оферты</a>, даю{' '}
                  <a href="/personal-data-consent">
                    согласие на обработку персональных данных
                  </a>{' '}
                  и ознакомлен с{' '}
                  <a href="/privacy">политикой конфиденциальности</a>.
                </span>
              </label>

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
              <strong className="xk-payment-summary__value">
                {selectedProduct.name}
              </strong>
            </div>
            <div className="xk-payment-summary__row">
              <span>Стоимость</span>
              <strong className="xk-payment-summary__value">
                {selectedProduct.amountRub} руб.
              </strong>
            </div>
            {promoCode.trim() ? (
              <p className="xk-payment-note">
                Промокод будет проверен при создании платежа.
              </p>
            ) : null}
            <p className="xk-payment-note">
              Перед оплатой подтвердите оферту, политику конфиденциальности и
              согласие на обработку персональных данных в форме заказа.
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
              После оплаты цифровая услуга активируется автоматически для
              указанного никнейма.
            </p>
            <p>
              Это не физический товар: доставка не требуется, получение заказа
              происходит через активацию внутри сервера.
            </p>
          </LandingCard>
        </div>
      </LandingSection>
    </main>
  )
}
