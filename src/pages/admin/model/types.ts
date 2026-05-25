import type { AdminPlayerRow } from './api'
import type {
  SiteNavigationIconKey,
  SiteNavigationItem,
  SiteNavigationRole,
} from '@/entities/site'

export type ConfirmationState = {
  title: string
  description: string
  confirmLabel: string
  confirmColor?: 'default' | 'danger' | 'success' | 'warning' | 'accent'
  onConfirm: () => void | Promise<void>
} | null

export type NavigationEditorState = {
  key: SiteNavigationItem['key']
  label: string
  icon: SiteNavigationIconKey
  audiences: SiteNavigationRole[]
} | null

export type PlayerRolesEditorState = {
  player: AdminPlayerRow
  roles: string[]
} | null

export type AdminStats = {
  totalPayments: number
  paidCount: number
  pendingCount: number
  totalLifeLogs: number
  totalPromoCodes: number
  activePromoCodes: number
  totalApplications: number
  pendingApplications: number
  totalPosts: number
  publishedPosts: number
  totalPlayers: number
  blockedPlayers: number
  totalWhitelist: number
}
