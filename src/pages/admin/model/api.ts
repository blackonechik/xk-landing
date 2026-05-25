import { apiBaseUrl } from '@/shared/api/config'
import type { SiteNavigationItem } from '@/entities/site'

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

export type AdminApplicationRow = {
  id: string
  nickname: string
  contact: string
  telegram: string
  discord: string
  age: number
  serverPlans: string
  status: string
  reviewedBy: string | null
  reviewNote: string | null
  createdAt: string
  updatedAt: string
}

export type AdminPostRow = {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  coverTone: string
  coverImageUrl: string | null
  submittedByNickname: string | null
  moderationStatus: string
  reviewedBy: string | null
  reviewNote: string | null
  isPinned: boolean
  pinnedOrder: number | null
  isPublished: boolean
  authorName: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export type AdminPlayerRow = {
  nickname: string
  lowercaseNickname: string
  discordId: string
  blocked: boolean
  roles: string[]
  lastLoginAt: string | null
  registeredAt: string | null
}

export type AdminSettings = {
  navigation: {
    showBank: boolean
    items: SiteNavigationItem[]
  }
}

export type AdminWhitelistRow = {
  nickname: string
  active: boolean
  purchaseId: string | null
  source: string | null
  createdAt: string
  updatedAt: string
}

export type AdminDashboard = {
  payments: AdminPaymentRow[]
  lifeLogs: AdminLifeLogRow[]
  applications: AdminApplicationRow[]
  posts: AdminPostRow[]
  settings: AdminSettings
  players: AdminPlayerRow[]
  whitelist: AdminWhitelistRow[]
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

type UpdateApplicationPayload = {
  status?: string
  reviewNote?: string | null
  reviewedBy?: string | null
}

type CreatePostPayload = {
  slug?: string
  title: string
  summary: string
  content: string
  coverTone?: string
  coverImageUrl?: string | null
  submittedByNickname?: string | null
  moderationStatus?: string
  reviewedBy?: string | null
  reviewNote?: string | null
  isPinned?: boolean
  pinnedOrder?: number | null
  isPublished?: boolean
  authorName?: string | null
}

type UpdatePostPayload = CreatePostPayload

export async function fetchAdminDashboard(): Promise<AdminDashboard> {
  const response = await fetch(`${apiBaseUrl}/api/admin/dashboard`, {
    credentials: 'include',
  })

  const data = (await response.json().catch(() => undefined)) as
    | AdminDashboard
    | { error?: string }
    | undefined

  if (response.status === 401 || response.status === 403) {
    throw new Error(
      'Доступ к админке есть только у пользователей с ролью администратора.',
    )
  }

  if (!response.ok || !data || !('payments' in data) || !('lifeLogs' in data)) {
    throw new Error('Не удалось загрузить данные админки.')
  }

  return data
}

export async function fetchPromoCodes(): Promise<AdminPromoCodeRow[]> {
  const response = await fetch(`${apiBaseUrl}/api/admin/promocodes`, {
    credentials: 'include',
  })

  const data = (await response.json().catch(() => undefined)) as
    | { promoCodes: AdminPromoCodeRow[] }
    | { error?: string }
    | undefined

  if (response.status === 401 || response.status === 403) {
    throw new Error(
      'Доступ к админке есть только у пользователей с ролью администратора.',
    )
  }

  if (!response.ok || !data || !('promoCodes' in data)) {
    throw new Error('Не удалось загрузить промокоды.')
  }

  return data.promoCodes
}

export async function createPromoCode(payload: CreatePromoCodePayload) {
  const response = await fetch(`${apiBaseUrl}/api/admin/promocodes`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
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

export async function updatePromoCode(
  promoId: string,
  payload: UpdatePromoCodePayload,
) {
  const response = await fetch(
    `${apiBaseUrl}/api/admin/promocodes/${promoId}`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )

  const data = (await response.json().catch(() => undefined)) as
    | { promoCode: AdminPromoCodeRow }
    | { message?: string }
    | undefined

  if (!response.ok) {
    throw new Error(readErrorMessage(data) ?? 'Не удалось обновить промокод.')
  }

  if (!data || !('promoCode' in data)) {
    throw new Error(
      'Backend вернул неожиданный ответ при обновлении промокода.',
    )
  }

  return data.promoCode
}

export async function updateAdminApplication(
  applicationId: string,
  payload: UpdateApplicationPayload,
) {
  const response = await fetch(
    `${apiBaseUrl}/api/admin/applications/${applicationId}`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )

  const data = (await response.json().catch(() => undefined)) as
    | { application: AdminApplicationRow }
    | { message?: string }
    | undefined

  if (!response.ok) {
    throw new Error(readErrorMessage(data) ?? 'Не удалось обновить заявку.')
  }

  if (!data || !('application' in data)) {
    throw new Error('Backend вернул неожиданный ответ при обновлении заявки.')
  }

  return data.application
}

export async function createAdminPost(payload: CreatePostPayload) {
  const response = await fetch(`${apiBaseUrl}/api/admin/posts`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => undefined)) as
    | { post: AdminPostRow }
    | { message?: string }
    | undefined

  if (!response.ok) {
    throw new Error(readErrorMessage(data) ?? 'Не удалось создать пост.')
  }

  if (!data || !('post' in data)) {
    throw new Error('Backend вернул неожиданный ответ при создании поста.')
  }

  return data.post
}

export async function updateAdminPost(
  postId: string,
  payload: UpdatePostPayload,
) {
  const response = await fetch(`${apiBaseUrl}/api/admin/posts/${postId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => undefined)) as
    | { post: AdminPostRow }
    | { message?: string }
    | undefined

  if (!response.ok) {
    throw new Error(readErrorMessage(data) ?? 'Не удалось обновить пост.')
  }

  if (!data || !('post' in data)) {
    throw new Error('Backend вернул неожиданный ответ при обновлении поста.')
  }

  return data.post
}

export async function updateAdminNavigation(items: SiteNavigationItem[]) {
  const response = await fetch(`${apiBaseUrl}/api/admin/settings/navigation`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  })

  const data = (await response.json().catch(() => undefined)) as
    | AdminSettings
    | { message?: string }
    | undefined

  if (!response.ok) {
    throw new Error(readErrorMessage(data) ?? 'Не удалось обновить навигацию.')
  }

  if (!data || !('navigation' in data)) {
    throw new Error(
      'Backend вернул неожиданный ответ при обновлении навигации.',
    )
  }

  return data
}

export async function updateAdminPlayerBlocked(
  nickname: string,
  blocked: boolean,
) {
  const response = await fetch(
    `${apiBaseUrl}/api/admin/players/${encodeURIComponent(nickname)}/block`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blocked }),
    },
  )

  const data = (await response.json().catch(() => undefined)) as
    | { ok: true }
    | { message?: string }
    | undefined

  if (!response.ok) {
    throw new Error(
      readErrorMessage(data) ?? 'Не удалось изменить блокировку игрока.',
    )
  }

  return data
}

export async function updateAdminPlayerRoles(
  nickname: string,
  roles: string[],
) {
  const response = await fetch(
    `${apiBaseUrl}/api/admin/players/${encodeURIComponent(nickname)}/roles`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roles }),
    },
  )

  const data = (await response.json().catch(() => undefined)) as
    | { roles: string[] }
    | { message?: string }
    | undefined

  if (!response.ok) {
    throw new Error(
      readErrorMessage(data) ?? 'Не удалось изменить роли игрока.',
    )
  }

  if (!data || !('roles' in data)) {
    throw new Error('Backend вернул неожиданный ответ при обновлении ролей.')
  }

  return data.roles
}

export async function createAdminWhitelistEntry(nickname: string) {
  const response = await fetch(`${apiBaseUrl}/api/admin/whitelist`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nickname }),
  })

  const data = (await response.json().catch(() => undefined)) as
    | { entry: AdminWhitelistRow }
    | { message?: string }
    | undefined

  if (!response.ok) {
    throw new Error(
      readErrorMessage(data) ?? 'Не удалось добавить игрока в whitelist.',
    )
  }

  if (!data || !('entry' in data)) {
    throw new Error(
      'Backend вернул неожиданный ответ при добавлении в whitelist.',
    )
  }

  return data.entry
}

export async function deleteAdminWhitelistEntry(nickname: string) {
  const response = await fetch(
    `${apiBaseUrl}/api/admin/whitelist/${encodeURIComponent(nickname)}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  )

  const data = (await response.json().catch(() => undefined)) as
    | { ok: true }
    | { message?: string }
    | { error?: string }
    | undefined

  if (!response.ok) {
    throw new Error(
      readErrorMessage(data) ?? 'Не удалось удалить игрока из whitelist.',
    )
  }

  return data
}

function readErrorMessage(data: unknown) {
  if (!data || typeof data !== 'object' || !('message' in data)) {
    return undefined
  }

  const message = (data as { message?: unknown }).message
  return typeof message === 'string' ? message : undefined
}
