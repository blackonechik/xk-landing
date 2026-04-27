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

export type AdminDashboard = {
  payments: AdminPaymentRow[]
  lifeLogs: AdminLifeLogRow[]
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
