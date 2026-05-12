import type { ReactNode } from 'react'
import {
  ArrowRightLeft,
  CreditCard,
  Crown,
  History,
  House,
  Landmark,
} from 'lucide-react'
import type { BankView } from '@/widgets/account/bank-cabinet'

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
  currentSection: 'home' | 'bank'
  activeBankView: BankView
  onBankViewNavigate: (view: BankView) => void
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

export function getAccountSidebarMenuSections({
  currentSection,
  activeBankView,
  onBankViewNavigate,
}: GetAccountSidebarMenuSectionsParams): AccountSidebarMenuSection[] {
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
        {
          key: 'bank',
          icon: <Landmark size={18} />,
          label: 'Банк',
          onPress: () => onBankViewNavigate('cards'),
          current: currentSection === 'bank' && activeBankView === 'cards',
          children: bankItems.map((item) => ({
            key: item.view,
            icon: item.icon,
            label: item.label,
            onPress: () => onBankViewNavigate(item.view),
            current: currentSection === 'bank' && activeBankView === item.view,
            size: 'sm',
          })),
        },
      ],
    },
    {
      key: 'secondary',
      items: [
        {
          key: 'kingdoms',
          icon: <Crown size={18} />,
          label: 'Королевства',
        },
      ],
    },
  ]
}