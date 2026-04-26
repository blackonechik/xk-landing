import { useMemo, useState } from 'react'
import { createPayment } from '../model/api'
import { paymentProducts } from '../model/products'
import type { PaymentProductId } from '../model/products'
import { LandingButton } from '@/shared/ui/landing-button'
import { LandingCard } from '@/shared/ui/landing-card'
import { LandingSection } from '@/shared/ui/landing-section'

const nicknamePattern = /^[A-Za-z0-9_]{3,16}$/

export function PaymentPage() {
  const [nickname, setNickname] = useState('')
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

    if (!nicknamePattern.test(normalizedNickname)) {
      setError('Ник должен быть от 3 до 16 символов: латиница, цифры и подчёркивание.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const payment = await createPayment({
        nickname: normalizedNickname,
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
        <div className="xk-payment-layout mt-50">
          <LandingCard title="Заказ" contentClassName="xk-payment-card" infoClassName="xk-payment-card__body">
            <form className="xk-payment-form" onSubmit={handleSubmit}>
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
                    <span className="xk-payment-product__name">{product.name}</span>
                    <span className="xk-payment-product__text">{product.description}</span>
                    <strong>{product.amountRub} руб.</strong>
                  </label>
                ))}
              </div>

              {error ? <p className="xk-payment-error">{error}</p> : null}

              <LandingButton
                as="button"
                type="submit"
                tone="success"
                contentClassName="text-40"
                disabled={isSubmitting}
                arrow
              >
                {isSubmitting ? 'Создаём оплату' : 'Перейти к оплате'}
              </LandingButton>
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
              <strong>{selectedProduct.name}</strong>
            </div>
            <div className="xk-payment-summary__row">
              <span>Стоимость</span>
              <strong>{selectedProduct.amountRub} руб.</strong>
            </div>
            <p>
              Сейчас оплата работает через подготовленную заглушку ЮMoney. После подключения
              реального API этот экран останется тем же, поменяется только provider на backend.
            </p>
          </LandingCard>
        </div>
      </LandingSection>
    </main>
  )
}
