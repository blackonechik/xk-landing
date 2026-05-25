import type { ReactNode } from 'react'
import type { PublicPlayerProfile } from '@/entities/player'

export type ProfileStatusPanelProps = {
  player: PublicPlayerProfile
  actions?: ReactNode
  isOwnProfile?: boolean
  totalDiamonds?: number
}

export type QuickSectionCardProps = {
  cardClassName?: string
  description: string
  gradient: string
  href?: string
  icon: ReactNode
  imageSrc: string
  imageClassName?: string
  onPress?: () => void
  textClassName?: string
  title: string
}

export type QuickSection = QuickSectionCardProps & {
  isComingSoon?: boolean
  requiresBankNavigation?: boolean
}
