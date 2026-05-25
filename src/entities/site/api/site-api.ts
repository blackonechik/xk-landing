import { apiBaseUrl } from '@/shared/api/config'
import type { JoinApplication, SitePost, SiteSettings } from '../model/types'

let siteSettingsCache: SiteSettings | null = null
let siteSettingsRequest: Promise<SiteSettings> | null = null

export async function fetchSiteSettings() {
  const response = await fetch(`${apiBaseUrl}/api/site/settings`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('SITE_SETTINGS_LOAD_FAILED')
  }

  return (await response.json()) as SiteSettings
}

export async function fetchSiteSettingsCached() {
  if (siteSettingsCache) {
    return siteSettingsCache
  }

  if (!siteSettingsRequest) {
    siteSettingsRequest = fetchSiteSettings()
      .then((payload) => {
        siteSettingsCache = payload
        return payload
      })
      .finally(() => {
        siteSettingsRequest = null
      })
  }

  return siteSettingsRequest
}

export function clearSiteSettingsCache() {
  siteSettingsCache = null
  siteSettingsRequest = null
}

export async function fetchSitePosts() {
  const response = await fetch(`${apiBaseUrl}/api/posts`)

  if (!response.ok) {
    throw new Error('POSTS_LOAD_FAILED')
  }

  const payload = (await response.json()) as { posts: SitePost[] }
  return payload.posts
}

export async function fetchSitePost(slug: string) {
  const response = await fetch(`${apiBaseUrl}/api/posts/${encodeURIComponent(slug)}`)

  if (!response.ok) {
    throw new Error(response.status === 404 ? 'POST_NOT_FOUND' : 'POST_LOAD_FAILED')
  }

  const payload = (await response.json()) as { post: SitePost }
  return payload.post
}

export async function submitSitePost(payload: {
  slug?: string
  title: string
  summary: string
  content: string
  coverTone?: string
  coverImageUrl?: string | null
}) {
  const response = await fetch(`${apiBaseUrl}/api/posts/submissions`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => undefined)) as
    | { post: SitePost; message?: string }
    | { message?: string }
    | undefined

  if (!response.ok) {
    const message =
      data && 'message' in data && typeof data.message === 'string'
        ? data.message
        : 'Не удалось отправить пост на модерацию.'
    throw new Error(message)
  }

  if (!data || !('post' in data)) {
    throw new Error('Неожиданный ответ сервера при отправке поста.')
  }

  return data.post
}

export async function createJoinApplication(payload: {
  nickname: string
  contact: string
  telegram: string
  discord: string
  age: number
  serverPlans: string
}) {
  const response = await fetch(`${apiBaseUrl}/api/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => undefined)) as
    | { application: JoinApplication }
    | { message?: string }
    | undefined

  if (!response.ok) {
    const message =
      data && 'message' in data && typeof data.message === 'string'
        ? data.message
        : 'Не удалось отправить заявку.'
    throw new Error(message)
  }

  if (!data || !('application' in data)) {
    throw new Error('Неожиданный ответ сервера при отправке заявки.')
  }

  return data.application
}
