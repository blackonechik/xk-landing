import { apiBaseUrl } from '@/shared/api/config'
import type { PaymentProductId } from './products'

type CreatePaymentPayload = {
  nickname: string
  email: string
  productId: PaymentProductId
  promoCode?: string
}

type CreatePaymentResponse = {
  payment: {
    id: string
    confirmationUrl: string
  }
}

export type PaymentStatus = 'pending' | 'paid' | 'failed'

type PaymentStatusResponse = {
  payment: {
    id: string
    status: PaymentStatus
  }
}

export async function createPayment(payload: CreatePaymentPayload) {
  const response = await fetch(`${apiBaseUrl}/api/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => undefined)) as
    | CreatePaymentResponse
    | { message?: string }
    | undefined

  if (!response.ok) {
    throw new Error(readErrorMessage(data) ?? 'Не удалось создать оплату.')
  }

  if (!data || !('payment' in data)) {
    throw new Error('Backend вернул неожиданный ответ.')
  }

  return data.payment
}

export async function getPaymentStatus(
  orderId: string,
): Promise<PaymentStatus> {
  const response = await fetch(`${apiBaseUrl}/api/payments/${orderId}`)
  const data = (await response.json().catch(() => undefined)) as
    | PaymentStatusResponse
    | { error?: string }
    | undefined

  if (response.status === 404) {
    return 'failed'
  }

  if (!response.ok || !data || !('payment' in data)) {
    throw new Error('Не удалось получить статус оплаты.')
  }

  if (data.payment.status === 'paid') {
    return 'paid'
  }

  if (data.payment.status === 'failed') {
    return 'failed'
  }

  return 'pending'
}

function readErrorMessage(data: unknown) {
  if (!data || typeof data !== 'object' || !('message' in data)) {
    return undefined
  }

  const message = (data as { message?: unknown }).message
  return typeof message === 'string' ? message : undefined
}
