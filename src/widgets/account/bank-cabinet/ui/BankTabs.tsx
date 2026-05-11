import { TabSwitcher } from '@/shared/ui/tab-switcher'

export type BankView = 'cards' | 'transfer' | 'history'

const bankTabs = [
  { id: 'cards', label: 'Карты' },
  { id: 'transfer', label: 'Перевод' },
  { id: 'history', label: 'История' },
] satisfies { id: BankView; label: string }[]

type BankTabsProps = {
  activeView: BankView
  onChange: (view: BankView) => void
}

export function BankTabs({ activeView, onChange }: BankTabsProps) {
  return (
    <TabSwitcher
      activeId={activeView}
      items={bankTabs}
      onChange={onChange}
      className="xk-bank-tabs"
      ariaLabel="Разделы банка"
    />
  )
}
