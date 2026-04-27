import { useEffect, useMemo, useState } from 'react'
import { getPaymentStatus } from '../model/api'
import { LandingButton } from '@/shared/ui/landing-button'
import { LandingCard } from '@/shared/ui/landing-card'
import { LandingSection } from '@/shared/ui/landing-section'

type PaymentStatusVariant = 'pending' | 'success' | 'failed'

type PaymentStatusPageProps = {
  variant: PaymentStatusVariant
}

function readOrderIdFromSearch() {
  if (typeof window === 'undefined') {
    return ''
  }

  return new URLSearchParams(window.location.search).get('orderId')?.trim() ?? ''
}

function goToStatusPage(status: 'pending' | 'paid' | 'failed', orderId: string) {
  const encodedOrderId = encodeURIComponent(orderId)

  if (status === 'paid') {
    window.location.replace(`/payment/success?orderId=${encodedOrderId}`)
    return
  }

  if (status === 'failed') {
    window.location.replace(`/payment/failed?orderId=${encodedOrderId}`)
    return
  }

  window.location.replace(`/payment/pending?orderId=${encodedOrderId}`)
}

export function PaymentStatusPage({ variant }: PaymentStatusPageProps) {
  const orderId = useMemo(() => readOrderIdFromSearch(), [])
  const [hint, setHint] = useState('')
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false)

  useEffect(() => {
    if (variant !== 'pending' || !orderId) {
      return
    }

    let isCancelled = false

    const refreshStatus = async () => {
      try {
        const status = await getPaymentStatus(orderId)

        if (isCancelled) {
          return
        }

        if (status === 'paid' || status === 'failed') {
          goToStatusPage(status, orderId)
          return
        }

        setHint('Платёж создан, ожидаем подтверждение от ЮKassa.')
      } catch {
        if (!isCancelled) {
          setHint('Статус пока недоступен. Проверим ещё раз автоматически.')
        }
      }
    }

    void refreshStatus()
    const timer = window.setInterval(() => {
      void refreshStatus()
    }, 3500)

    return () => {
      isCancelled = true
      window.clearInterval(timer)
    }
  }, [orderId, variant])

  async function refreshPaymentStatusManually() {
    if (!orderId || variant !== 'pending') {
      return
    }

    setIsRefreshingStatus(true)
    setHint('')

    try {
      const status = await getPaymentStatus(orderId)

      if (status === 'paid' || status === 'failed') {
        goToStatusPage(status, orderId)
        return
      }

      setHint('Оплата ещё не завершена. Обновите страницу через несколько секунд.')
    } catch {
      setHint('Не удалось проверить статус. Попробуйте чуть позже.')
    } finally {
      setIsRefreshingStatus(false)
    }
  }

  const title =
    variant === 'success' ? 'Оплата успешна' : variant === 'failed' ? 'Оплата не прошла' : 'Ожидание оплаты'
  const tone = variant === 'success' ? 'green' : variant === 'failed' ? 'orange' : 'gold'

  return (
    <main className="tycoon-landing xk-payment-page">
      <LandingSection
        id="payment-status"
        tone="brown"
        title="Оплата"
        mark="Статус платежа"
        titleClassName="tycoon-color-yellow"
        markClassName="tycoon-color-orange-2"
        wrapperClassName="xk-payment-wrapper"
        withEffect
        withEnding
        withLine={false}
      >
        <div className="xk-payment-status-layout mt-20">
          <LandingCard title={title} tone={tone} contentClassName="xk-payment-card" infoClassName="xk-payment-status">
            {variant === 'success' ? (
              <p className="xk-payment-status__title">Платёж подтверждён. Цифровая услуга активирована.</p>
            ) : null}
            {variant === 'failed' ? (
              <p className="xk-payment-status__title">Платёж не был подтверждён. Можно попробовать ещё раз.</p>
            ) : null}
            {variant === 'pending' ? (
              <p className="xk-payment-status__title">Мы проверяем статус платежа. Обычно это занимает несколько секунд.</p>
            ) : null}

            <p className="xk-payment-status__text">
              ID заказа: <strong>{orderId || 'не найден'}</strong>
            </p>
            {hint ? <p className="xk-payment-status__hint">{hint}</p> : null}

            <div className="xk-payment-status__actions">
              {variant === 'pending' ? (
                <LandingButton
                  as="button"
                  type="button"
                  tone="success"
                  contentClassName="xk-payment-summary__submit-content"
                  onClick={() => void refreshPaymentStatusManually()}
                  disabled={isRefreshingStatus || !orderId}
                  arrow
                >
                  {isRefreshingStatus ? 'Проверяем статус' : 'Проверить сейчас'}
                </LandingButton>
              ) : null}

              <LandingButton
                as="a"
                href="/payment"
                tone={variant === 'success' ? 'default' : 'success'}
                contentClassName="xk-payment-summary__submit-content"
                arrow
              >
                {variant === 'success' ? 'Оформить ещё покупку' : 'Вернуться к оплате'}
              </LandingButton>

              <LandingButton
                as="a"
                href="/"
                tone="primary"
                contentClassName="xk-payment-summary__submit-content"
              >
                На главную
              </LandingButton>
            </div>
          </LandingCard>
        </div>
      </LandingSection>
    </main>
  )
}
