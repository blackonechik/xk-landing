import { useMemo } from 'react'
import type { AdminDashboard, AdminPromoCodeRow } from '../model/api'
import type { AdminStats } from '../model/types'

export function useAdminStats(
  dashboard: AdminDashboard | null,
  promoCodes: AdminPromoCodeRow[],
) {
  return useMemo<AdminStats>(() => {
    const payments = dashboard?.payments ?? []
    const paidCount = payments.filter((item) => item.status === 'paid').length
    const pendingCount = payments.filter(
      (item) => item.status === 'pending',
    ).length

    return {
      totalPayments: payments.length,
      paidCount,
      pendingCount,
      totalLifeLogs: dashboard?.lifeLogs.length ?? 0,
      totalPromoCodes: promoCodes.length,
      activePromoCodes: promoCodes.filter((item) => item.isActive).length,
      totalApplications: dashboard?.applications.length ?? 0,
      pendingApplications:
        dashboard?.applications.filter((item) => item.status === 'new')
          .length ?? 0,
      totalPosts: dashboard?.posts.length ?? 0,
      publishedPosts:
        dashboard?.posts.filter((item) => item.isPublished).length ?? 0,
      totalPlayers: dashboard?.players.length ?? 0,
      blockedPlayers:
        dashboard?.players.filter((item) => item.blocked).length ?? 0,
      totalWhitelist: dashboard?.whitelist.length ?? 0,
    }
  }, [dashboard, promoCodes])
}
