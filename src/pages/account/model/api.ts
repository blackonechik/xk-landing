import { apiBaseUrl } from '@/shared/api/config'

export type CabinetPlayer = {
  nickname: string
  lowercaseNickname: string
  uuid: string | null
  premiumUuid: string | null
  registeredAt: string | null
  lastLoginAt: string | null
  lives: number
  social: {
    discordId: string
    blocked: boolean
    totpEnabled: boolean
    notifyEnabled: boolean
  }
}

export type BankCard = {
  id: string
  ownerNickname: string
  title: string
  design: string
  cardNumber: string
  balanceDiamonds: number
  createdAt: string
}

export type BankTransfer = {
  id: string
  fromCardId: string
  toCardId: string
  fromOwner: string
  toOwner: string
  amountDiamonds: number
  comment: string | null
  createdAt: string
}

export type AccountPayload = {
  player: CabinetPlayer
  bank: {
    cards: BankCard[]
    transfers: BankTransfer[]
    limits: {
      maxCardsPerPlayer: number
      minTransferDiamonds: number
      maxTransferDiamonds: number
      dailyTransferDiamondsLimit: number
    }
  }
}

export function getDiscordLoginUrl() {
  return `${apiBaseUrl}/api/auth/discord`
}

export async function fetchAccount() {
  const response = await fetch(`${apiBaseUrl}/api/account/me`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(
      response.status === 401 ? 'UNAUTHORIZED' : 'ACCOUNT_LOAD_FAILED',
    )
  }

  return (await response.json()) as AccountPayload
}

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
  const response = await fetch(`${apiBaseUrl}/api/account/bank/cards/${cardId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? 'CARD_CLOSE_FAILED')
  }
}

export async function transferDiamonds(payload: {
  fromCardId: string
  toCardNumber: string
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

export async function logout() {
  await fetch(`${apiBaseUrl}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}
