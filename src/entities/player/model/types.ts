import type { PlayerProfileAppearance } from '@/entities/account'

export type PlayerDailyActivity = {
  date: string
  playedHours: number
}

export type PublicPlayerProfile = {
  nickname: string
  uuid: string | null
  lives: number | null
  lastLoginAt: string | null
  playedHours: number
  isOnline: boolean
  stats: {
    totalHours: number
    monthHours: number
    weekHours: number
    todayHours: number
  }
  activity: PlayerDailyActivity[]
  appearance: PlayerProfileAppearance
  rating: {
    likes: number
    dislikes: number
    score: number
    currentUserRating: -1 | 0 | 1
  }
}
