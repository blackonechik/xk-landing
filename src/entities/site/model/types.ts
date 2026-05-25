export type SiteNavigationRole = 'player' | 'moderator' | 'admin'

export type SiteNavigationItemKey =
  | 'home'
  | 'bank'
  | 'stats'
  | 'news'
  | 'kingdoms'
  | 'admin'

export type SiteNavigationIconKey =
  | 'house'
  | 'landmark'
  | 'bar-chart-3'
  | 'newspaper'
  | 'crown'
  | 'shield-check'

export type SiteNavigationItem = {
  key: SiteNavigationItemKey
  label: string
  icon: SiteNavigationIconKey
  audiences: SiteNavigationRole[]
  visible: boolean
  deleted: boolean
  order: number
  section: 'primary' | 'secondary'
}

export type SiteNavigationSettings = {
  showBank: boolean
  items: SiteNavigationItem[]
}

export type SiteSettings = {
  navigation: SiteNavigationSettings
}

export type SitePost = {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  coverTone: string
  coverImageUrl: string | null
  isPinned: boolean
  pinnedOrder: number | null
  isPublished: boolean
  authorName: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export type JoinApplication = {
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
