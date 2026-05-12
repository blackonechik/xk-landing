import { Tabs } from '@heroui/react'

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
    <Tabs
      selectedKey={activeView}
      onSelectionChange={(key) => onChange(key as BankView)}
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label="Разделы банка">
          {bankTabs.map((tab) => (
            <Tabs.Tab id={tab.id} key={tab.id}>
              {tab.label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  )
}
