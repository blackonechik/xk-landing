import { apiBaseUrl } from '@/shared/api/config'
import type { PublicPlayerProfile } from '../model/types'

export function formatPlayedHours(value: number | null | undefined) {
  if (typeof value !== 'number') {
    return 'нет данных'
  }

  return `${value.toLocaleString('ru-RU', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })} ч.`
}

export async function fetchPlayers(limit = 60) {
  const response = await fetch(`${apiBaseUrl}/api/players?limit=${limit}`)

  if (!response.ok) {
    throw new Error('PLAYERS_LOAD_FAILED')
  }

  const payload = (await response.json()) as {
    players: PublicPlayerProfile[]
  }

  return payload.players
}

export async function fetchPlayerProfile(nickname: string) {
  const response = await fetch(
    `${apiBaseUrl}/api/players/${encodeURIComponent(nickname)}`,
  )

  if (!response.ok) {
    throw new Error(
      response.status === 404 ? 'PLAYER_NOT_FOUND' : 'PLAYER_LOAD_FAILED',
    )
  }

  const payload = (await response.json()) as {
    player: PublicPlayerProfile
  }

  return payload.player
}

export async function ratePlayer(nickname: string, value: -1 | 0 | 1) {
  const response = await fetch(
    `${apiBaseUrl}/api/players/${encodeURIComponent(nickname)}/rating`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    },
  )

  if (!response.ok) {
    throw new Error(
      response.status === 401 ? 'UNAUTHORIZED' : 'PLAYER_RATING_FAILED',
    )
  }

  const payload = (await response.json()) as {
    player: PublicPlayerProfile
  }

  return payload.player
}
