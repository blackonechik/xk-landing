import { apiBaseUrl } from '@/shared/api/config'
import type { PaymentProductId } from './products'

type CreatePaymentPayload = {
  nickname: string
  email: string
  telegram: string
  productId: PaymentProductId
}

type CreatePaymentResponse = {
  payment: {
    id: string
    confirmationUrl: string
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

function readErrorMessage(data: unknown) {
  if (!data || typeof data !== 'object' || !('message' in data)) {
    return undefined
  }

  const message = (data as { message?: unknown }).message
  return typeof message === 'string' ? message : undefined
}
