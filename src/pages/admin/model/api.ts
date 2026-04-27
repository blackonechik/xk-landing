import { apiBaseUrl } from '@/shared/api/config'

export type AdminPaymentRow = {
  id: string
  nickname: string
  productId: string
  productName: string
  amountRub: number
  status: string
  provider: string
  providerPaymentId: string | null
  createdAt: string
  updatedAt: string
}

export type AdminLifeLogRow = {
  id: string
  orderId: string
  paymentId: string
  providerPaymentId: string
  playerUuid: string
  playerName: string
  productId: string
  livesDelta: number
  previousLives: number
  newLives: number
  createdAt: string
}

export type AdminPromoCodeRow = {
  id: string
  code: string
  discountType: 'percent' | 'fixed'
  discountValue: number
  maxUses: number | null
  maxUsesPerNickname: number | null
  usedCount: number
  isActive: boolean
  startsAt: string | null
  endsAt: string | null
  createdAt: string
  updatedAt: string
}

export type AdminDashboard = {
  payments: AdminPaymentRow[]
  lifeLogs: AdminLifeLogRow[]
}

type CreatePromoCodePayload = {
  code: string
  discountType: 'percent' | 'fixed'
  discountValue: number
  maxUses?: number
  maxUsesPerNickname?: number
  startsAt?: string
  endsAt?: string
  isActive?: boolean
}

type UpdatePromoCodePayload = {
  maxUses?: number
  maxUsesPerNickname?: number
  startsAt?: string
  endsAt?: string
  isActive?: boolean
}

export async function fetchAdminDashboard(adminToken: string): Promise<AdminDashboard> {
  const response = await fetch(`${apiBaseUrl}/api/admin/dashboard`, {
    headers: {
      'x-admin-token': adminToken,
    },
  })

  const data = (await response.json().catch(() => undefined)) as
    | AdminDashboard
    | { error?: string }
    | undefined

  if (response.status === 401) {
    throw new Error('Неверный admin token.')
  }

  if (response.status === 503) {
    throw new Error('Админка не настроена на backend (ADMIN_TOKEN пустой).')
  }

  if (!response.ok || !data || !('payments' in data) || !('lifeLogs' in data)) {
    throw new Error('Не удалось загрузить данные админки.')
  }

  return data
}

export async function fetchPromoCodes(adminToken: string): Promise<AdminPromoCodeRow[]> {
  const response = await fetch(`${apiBaseUrl}/api/admin/promocodes`, {
    headers: {
      'x-admin-token': adminToken,
    },
  })

  const data = (await response.json().catch(() => undefined)) as
    | { promoCodes: AdminPromoCodeRow[] }
    | { error?: string }
    | undefined

  if (response.status === 401) {
    throw new Error('Неверный admin token.')
  }

  if (response.status === 503) {
    throw new Error('Админка не настроена на backend (ADMIN_TOKEN пустой).')
  }

  if (!response.ok || !data || !('promoCodes' in data)) {
    throw new Error('Не удалось загрузить промокоды.')
  }

  return data.promoCodes
}

export async function createPromoCode(adminToken: string, payload: CreatePromoCodePayload) {
  const response = await fetch(`${apiBaseUrl}/api/admin/promocodes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': adminToken,
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => undefined)) as
    | { promoCode: AdminPromoCodeRow }
    | { message?: string }
    | undefined

  if (!response.ok) {
    throw new Error(readErrorMessage(data) ?? 'Не удалось создать промокод.')
  }

  if (!data || !('promoCode' in data)) {
    throw new Error('Backend вернул неожиданный ответ при создании промокода.')
  }

  return data.promoCode
}

export async function updatePromoCode(adminToken: string, promoId: string, payload: UpdatePromoCodePayload) {
  const response = await fetch(`${apiBaseUrl}/api/admin/promocodes/${promoId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': adminToken,
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => undefined)) as
    | { promoCode: AdminPromoCodeRow }
    | { message?: string }
    | undefined

  if (!response.ok) {
    throw new Error(readErrorMessage(data) ?? 'Не удалось обновить промокод.')
  }

  if (!data || !('promoCode' in data)) {
    throw new Error('Backend вернул неожиданный ответ при обновлении промокода.')
  }

  return data.promoCode
}

function readErrorMessage(data: unknown) {
  if (!data || typeof data !== 'object' || !('message' in data)) {
    return undefined
  }

  const message = (data as { message?: unknown }).message
  return typeof message === 'string' ? message : undefined
}
