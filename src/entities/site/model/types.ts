export type SiteNavigationSettings = {
  showBank: boolean
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