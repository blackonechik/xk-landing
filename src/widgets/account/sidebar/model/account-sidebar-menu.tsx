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
  ReceiptText,
  Settings2,
  ShieldCheck,
  TicketPercent,
  Users,
} from 'lucide-react'
import type { BankView } from '@/widgets/account/bank-cabinet'

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
  currentSection: 'home' | 'bank' | 'stats' | 'admin'
  activeBankView: BankView
  activeAdminView?: AdminView
  hasBankCards: boolean
  isAdmin: boolean
  showBank: boolean
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

export function getAccountSidebarMenuSections({
  currentSection,
  activeBankView,
  activeAdminView = 'overview',
  hasBankCards,
  isAdmin,
  showBank,
  onBankViewNavigate,
  onAdminViewNavigate,
}: GetAccountSidebarMenuSectionsParams): AccountSidebarMenuSection[] {
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
          onPress: () => onAdminViewNavigate(item.view),
          current: currentSection === 'admin' && activeAdminView === item.view,
          size: 'sm' as const,
        }))
      : undefined

  return [
    {
      key: 'primary',
      items: [
        {
          key: 'home',
          icon: <House size={18} />,
          label: 'Главная',
          to: '/cabinet',
          current: currentSection === 'home',
        },
        ...(showBank
          ? [
              {
                key: 'bank',
                icon: <Landmark size={18} />,
                label: 'Банк',
                to: hasBankCards ? undefined : '/cabinet/bank',
                onPress: hasBankCards ? () => onBankViewNavigate('cards') : undefined,
                current: currentSection === 'bank',
                children: bankChildren,
              },
            ]
          : []),
      ],
    },
    {
      key: 'secondary',
      items: [
        {
          key: 'stats',
          icon: <BarChart3 size={18} />,
          label: 'Статистика',
          to: '/cabinet/stats',
          current: currentSection === 'stats',
        },
        {
          key: 'kingdoms',
          icon: <Crown size={18} />,
          label: 'Королевства',
        },
        ...(isAdmin
          ? [
              {
                key: 'admin',
                icon: <Landmark size={18} />,
                label: 'Админка',
                to: currentSection === 'admin' ? undefined : '/cabinet/admin',
                onPress:
                  currentSection === 'admin' && onAdminViewNavigate
                    ? () => onAdminViewNavigate('overview')
                    : undefined,
                badge: 'site',
                current: currentSection === 'admin',
                children: adminChildren,
              },
            ]
          : []),
      ],
    },
  ]
}
