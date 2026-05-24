import type { ReactNode } from 'react'
import {
  ArrowRightLeft,
  BarChart3,
  CreditCard,
  Crown,
  FileText,
  History,
  House,
  Landmark,
  LayoutDashboard,
  Newspaper,
  ReceiptText,
  Settings2,
  ShieldCheck,
  TicketPercent,
  Users,
} from 'lucide-react'
import type { BankView } from '@/widgets/account/bank-cabinet'
import type {
  SiteNavigationIconKey,
  SiteNavigationItem,
  SiteNavigationRole,
} from '@/entities/site'

export type AdminView =
  | 'overview'
  | 'applications'
  | 'posts'
  | 'navigation'
  | 'users'
  | 'payments'
  | 'whitelist'
  | 'promos'

export type AccountSidebarMenuItem = {
  key: string
  icon: ReactNode
  label: string
  to?: string
  onPress?: () => void
  current?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  badge?: string
  children?: AccountSidebarMenuItem[]
}

export type AccountSidebarMenuSection = {
  key: string
  items: AccountSidebarMenuItem[]
}

type GetAccountSidebarMenuSectionsParams = {
  currentSection: 'home' | 'bank' | 'stats' | 'news' | 'admin'
  activeBankView: BankView
  activeAdminView?: AdminView
  hasBankCards: boolean
  roles: SiteNavigationRole[]
  navigationItems?: SiteNavigationItem[]
  onBankViewNavigate: (view: BankView) => void
  onAdminViewNavigate?: (view: AdminView) => void
}

const bankItems = [
  {
    icon: <CreditCard size={18} />,
    label: 'Карты',
    view: 'cards',
  },
  {
    icon: <ArrowRightLeft size={18} />,
    label: 'Перевод',
    view: 'transfer',
  },
  {
    icon: <History size={18} />,
    label: 'История',
    view: 'history',
  },
] satisfies { icon: ReactNode; label: string; view: BankView }[]

const adminItems = [
  {
    icon: <LayoutDashboard size={18} />,
    label: 'Обзор',
    view: 'overview',
  },
  {
    icon: <ShieldCheck size={18} />,
    label: 'Заявки',
    view: 'applications',
  },
  {
    icon: <FileText size={18} />,
    label: 'Посты',
    view: 'posts',
  },
  {
    icon: <Settings2 size={18} />,
    label: 'Навигация',
    view: 'navigation',
  },
  {
    icon: <Users size={18} />,
    label: 'Пользователи',
    view: 'users',
  },
  {
    icon: <ReceiptText size={18} />,
    label: 'Покупки',
    view: 'payments',
  },
  {
    icon: <ShieldCheck size={18} />,
    label: 'Whitelist',
    view: 'whitelist',
  },
  {
    icon: <TicketPercent size={18} />,
    label: 'Промокоды',
    view: 'promos',
  },
] satisfies { icon: ReactNode; label: string; view: AdminView }[]

export const navigationIconOptions: {
  key: SiteNavigationIconKey
  label: string
  icon: ReactNode
}[] = [
  {
    key: 'house',
    label: 'Главная',
    icon: <House size={18} />,
  },
  {
    key: 'landmark',
    label: 'Банк',
    icon: <Landmark size={18} />,
  },
  {
    key: 'bar-chart-3',
    label: 'Статистика',
    icon: <BarChart3 size={18} />,
  },
  {
    key: 'newspaper',
    label: 'Посты',
    icon: <Newspaper size={18} />,
  },
  {
    key: 'crown',
    label: 'Королевства',
    icon: <Crown size={18} />,
  },
  {
    key: 'shield-check',
    label: 'Админка',
    icon: <ShieldCheck size={18} />,
  },
]

const navigationIconMap = Object.fromEntries(
  navigationIconOptions.map((item) => [item.key, item.icon]),
) as Record<SiteNavigationIconKey, ReactNode>

export function getNavigationIcon(icon: SiteNavigationIconKey) {
  return navigationIconMap[icon] ?? <House size={18} />
}

export const defaultSiteNavigationItems: SiteNavigationItem[] = [
  {
    key: 'home',
    label: 'Главная',
    icon: 'house',
    audiences: ['player', 'moderator', 'admin'],
    visible: true,
    deleted: false,
    order: 0,
    section: 'primary',
  },
  {
    key: 'bank',
    label: 'Банк',
    icon: 'landmark',
    audiences: ['player', 'moderator', 'admin'],
    visible: true,
    deleted: false,
    order: 1,
    section: 'primary',
  },
  {
    key: 'stats',
    label: 'Статистика',
    icon: 'bar-chart-3',
    audiences: ['player', 'moderator', 'admin'],
    visible: true,
    deleted: false,
    order: 2,
    section: 'secondary',
  },
  {
    key: 'news',
    label: 'Посты',
    icon: 'newspaper',
    audiences: ['player', 'moderator', 'admin'],
    visible: true,
    deleted: false,
    order: 3,
    section: 'secondary',
  },
  {
    key: 'kingdoms',
    label: 'Королевства',
    icon: 'crown',
    audiences: ['player', 'moderator', 'admin'],
    visible: true,
    deleted: false,
    order: 4,
    section: 'secondary',
  },
  {
    key: 'admin',
    label: 'Админка',
    icon: 'shield-check',
    audiences: ['admin'],
    visible: true,
    deleted: false,
    order: 5,
    section: 'secondary',
  },
]

export function getDefaultSiteNavigationItems() {
  return defaultSiteNavigationItems.map((item) => ({
    ...item,
    audiences: [...item.audiences],
  }))
}

export function resolveSiteNavigationItems(items?: SiteNavigationItem[]) {
  const source = items?.length ? items : getDefaultSiteNavigationItems()
  const itemMap = new Map(source.map((item) => [item.key, item]))

  return getDefaultSiteNavigationItems()
    .map((item) => ({
      ...item,
      ...(itemMap.get(item.key) ?? {}),
      audiences: [...(itemMap.get(item.key)?.audiences ?? item.audiences)],
    }))
    .sort((left, right) => left.order - right.order)
}

export function getAdminViewPath(view: AdminView) {
  return `/cabinet/admin/${view}` as const
}

export function getAdminViewFromPathname(pathname: string): AdminView {
  if (pathname.startsWith('/cabinet/admin/applications')) return 'applications'
  if (pathname.startsWith('/cabinet/admin/posts')) return 'posts'
  if (pathname.startsWith('/cabinet/admin/navigation')) return 'navigation'
  if (pathname.startsWith('/cabinet/admin/users')) return 'users'
  if (pathname.startsWith('/cabinet/admin/payments')) return 'payments'
  if (pathname.startsWith('/cabinet/admin/whitelist')) return 'whitelist'
  if (pathname.startsWith('/cabinet/admin/promos')) return 'promos'
  return 'overview'
}

function canSeeNavigationItem(item: SiteNavigationItem, roles: SiteNavigationRole[]) {
  if (item.deleted || !item.visible) {
    return false
  }

  return item.audiences.some((role) => roles.includes(role))
}

export function getAccountSidebarMenuSections({
  currentSection,
  activeBankView,
  activeAdminView = 'overview',
  hasBankCards,
  roles,
  navigationItems,
  onBankViewNavigate,
  onAdminViewNavigate,
}: GetAccountSidebarMenuSectionsParams): AccountSidebarMenuSection[] {
  const isAdmin = roles.includes('admin')
  const resolvedNavigation = resolveSiteNavigationItems(navigationItems)
  const visibleNavigation = resolvedNavigation.filter((item) =>
    canSeeNavigationItem(item, roles),
  )
  const visibleNavigationMap = new Map(visibleNavigation.map((item) => [item.key, item]))
  const bankChildren = hasBankCards
    ? bankItems.map((item) => ({
        key: item.view,
        icon: item.icon,
        label: item.label,
        onPress: () => onBankViewNavigate(item.view),
        current: currentSection === 'bank' && activeBankView === item.view,
        size: 'sm' as const,
      }))
    : undefined

  const adminChildren =
    isAdmin && onAdminViewNavigate
      ? adminItems.map((item) => ({
          key: item.view,
          icon: item.icon,
          label: item.label,
          to: getAdminViewPath(item.view),
          current: currentSection === 'admin' && activeAdminView === item.view,
          size: 'sm' as const,
        }))
      : undefined

  function mapTopLevelItem(item: SiteNavigationItem): AccountSidebarMenuItem | null {
    if (item.key === 'home') {
      return {
        key: item.key,
        icon: getNavigationIcon(item.icon),
        label: item.label,
        to: '/cabinet',
        current: currentSection === 'home',
      }
    }

    if (item.key === 'bank') {
      return {
        key: item.key,
        icon: getNavigationIcon(item.icon),
        label: item.label,
        to: hasBankCards ? undefined : '/cabinet/bank',
        onPress: hasBankCards ? () => onBankViewNavigate('cards') : undefined,
        current: currentSection === 'bank',
        children: bankChildren,
      }
    }

    if (item.key === 'stats') {
      return {
        key: item.key,
        icon: getNavigationIcon(item.icon),
        label: item.label,
        to: '/cabinet/stats',
        current: currentSection === 'stats',
      }
    }

    if (item.key === 'news') {
      return {
        key: item.key,
        icon: getNavigationIcon(item.icon),
        label: item.label,
        to: '/cabinet/news',
        current: currentSection === 'news',
      }
    }

    if (item.key === 'kingdoms') {
      return {
        key: item.key,
        icon: getNavigationIcon(item.icon),
        label: item.label,
      }
    }

    if (item.key === 'admin' && isAdmin) {
      return {
        key: item.key,
        icon: getNavigationIcon(item.icon),
        label: item.label,
        to: getAdminViewPath('overview'),
        badge: '!!!',
        current: currentSection === 'admin',
        children: adminChildren,
      }
    }

    return null
  }

  return [
    {
      key: 'primary',
      items: resolvedNavigation
        .filter((item) => item.section === 'primary' && visibleNavigationMap.has(item.key))
        .map(mapTopLevelItem)
        .filter((item): item is AccountSidebarMenuItem => Boolean(item)),
    },
    {
      key: 'secondary',
      items: resolvedNavigation
        .filter((item) => item.section === 'secondary' && visibleNavigationMap.has(item.key))
        .map(mapTopLevelItem)
        .filter((item): item is AccountSidebarMenuItem => Boolean(item)),
    },
  ]
}
