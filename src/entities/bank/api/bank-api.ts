import { apiBaseUrl } from '@/shared/api/config'

export async function createCard(payload: { title: string; design: string }) {
  const response = await fetch(`${apiBaseUrl}/api/account/bank/cards`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? 'CARD_CREATE_FAILED')
  }
}

export async function closeCard(cardId: string) {
  const response = await fetch(
    `${apiBaseUrl}/api/account/bank/cards/${cardId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  )

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? 'CARD_CLOSE_FAILED')
  }
}

export async function transferDiamonds(payload: {
  fromCardId: string
  toCardNumber?: string
  toOwnerNickname?: string
  amountDiamonds: string
  comment: string
}) {
  const response = await fetch(`${apiBaseUrl}/api/account/bank/transfers`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? 'TRANSFER_FAILED')
  }
}
