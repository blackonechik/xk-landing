import { apiBaseUrl } from '@/shared/api/config'
import type { AccountPayload } from '../model/types'

export function getDiscordLoginUrl(returnTo?: string) {
  const url = new URL(`${apiBaseUrl}/api/auth/discord`)

  if (returnTo) {
    url.searchParams.set('returnTo', returnTo)
  }

  return url.toString()
}

export function getSkinProxyUrl(identifier: string) {
  return `${apiBaseUrl}/api/account/skins/${encodeURIComponent(identifier)}`
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

export async function logout() {
  await fetch(`${apiBaseUrl}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}
