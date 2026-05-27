import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchAdminDashboard, fetchPromoCodes } from './api'
import { useAdminStats } from '../hooks/useAdminStats'
import { useAdminToasts } from '../hooks/useAdminToasts'
import { fetchAccountCached, getCachedAccount } from '@/entities/account'
import type { AccountPayload } from '@/entities/account'
import { defaultSiteNavigationItems } from '@/widgets/account/sidebar/model/account-sidebar-menu'
import type { SiteNavigationItem } from '@/entities/site'
import type { AdminDashboard, AdminPromoCodeRow } from './api'

type AdminPageContextValue = {
  account: AccountPayload | null
  dashboard: AdminDashboard | null
  setDashboard: Dispatch<SetStateAction<AdminDashboard | null>>
  promoCodes: AdminPromoCodeRow[]
  setPromoCodes: Dispatch<SetStateAction<AdminPromoCodeRow[]>>
  isLoading: boolean
  error: string
  isSessionAdmin: boolean
  navigationItems: SiteNavigationItem[]
  stats: ReturnType<typeof useAdminStats>
  showErrorToast: (message: string, description?: string) => void
  showInfoToast: (message: string, description?: string) => void
  showSuccessToast: (message: string, description?: string) => void
  reloadDashboard: () => Promise<void>
}

const AdminPageContext = createContext<AdminPageContextValue | null>(null)

export function AdminPageProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AccountPayload | null>(() =>
    getCachedAccount(),
  )
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null)
  const [promoCodes, setPromoCodes] = useState<AdminPromoCodeRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const isSessionAdmin = account?.player.siteRole === 'admin'
  const { showErrorToast, showInfoToast, showSuccessToast } = useAdminToasts()
  const stats = useAdminStats(dashboard, promoCodes)

  const navigationItems = useMemo(
    () =>
      (dashboard?.settings.navigation.items.length
        ? [...dashboard.settings.navigation.items]
        : [...defaultSiteNavigationItems]
      ).sort((left, right) => left.order - right.order),
    [dashboard?.settings.navigation.items],
  )

  useEffect(() => {
    let isActive = true

    void fetchAccountCached()
      .then((payload) => {
        if (isActive) {
          setAccount(payload)
        }
      })
      .catch(() => {
        if (isActive) {
          setAccount(null)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  async function reloadDashboard() {
    if (!isSessionAdmin) {
      const message =
        'Нужен вход под пользователем с ролью администратора сайта.'
      setError(message)
      showErrorToast('Доступ запрещен', message)
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const [dashboardData, promoData] = await Promise.all([
        fetchAdminDashboard(),
        fetchPromoCodes(),
      ])

      setDashboard(dashboardData)
      setPromoCodes(promoData)
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Ошибка загрузки данных.'
      setError(message)
      showErrorToast('Не удалось загрузить админку', message)
      setDashboard(null)
      setPromoCodes([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isSessionAdmin) {
      void reloadDashboard()
    }
  }, [isSessionAdmin])

  return (
    <AdminPageContext.Provider
      value={{
        account,
        dashboard,
        setDashboard,
        promoCodes,
        setPromoCodes,
        isLoading,
        error,
        isSessionAdmin,
        navigationItems,
        stats,
        showErrorToast,
        showInfoToast,
        showSuccessToast,
        reloadDashboard,
      }}
    >
      {children}
    </AdminPageContext.Provider>
  )
}

export function useAdminPageContext() {
  const context = useContext(AdminPageContext)

  if (!context) {
    throw new Error('useAdminPageContext must be used within AdminPageProvider')
  }

  return context
}
