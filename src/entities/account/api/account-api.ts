import { apiBaseUrl } from '@/shared/api/config'
import type { AccountPayload, PlayerProfileAppearance } from '../model/types'

let accountCache: AccountPayload | null = null
let accountRequest: Promise<AccountPayload> | null = null

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

export function getCachedAccount() {
  return accountCache
}

export async function fetchAccountCached() {
  if (accountCache) {
    return accountCache
  }

  if (!accountRequest) {
    accountRequest = fetchAccount()
      .then((payload) => {
        accountCache = payload
        return payload
      })
      .finally(() => {
        accountRequest = null
      })
  }

  return accountRequest
}

export function clearAccountCache() {
  accountCache = null
  accountRequest = null
}

export async function updateProfileAppearance(
  appearance: PlayerProfileAppearance,
) {
  const response = await fetch(`${apiBaseUrl}/api/account/profile/appearance`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appearance),
  })

  if (!response.ok) {
    throw new Error('PROFILE_APPEARANCE_UPDATE_FAILED')
  }

  const payload = (await response.json()) as {
    appearance: PlayerProfileAppearance
  }

  if (accountCache) {
    accountCache = {
      ...accountCache,
      player: {
        ...accountCache.player,
        appearance: payload.appearance,
      },
    }
  }

  return payload.appearance
}

export async function logout() {
  await fetch(`${apiBaseUrl}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
  clearAccountCache()
}
