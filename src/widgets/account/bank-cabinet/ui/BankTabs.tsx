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
    <div className="xk-bank-tabs" role="tablist" aria-label="Разделы банка">
      {bankTabs.map((tab) => (
        <button
          className={activeView === tab.id ? 'is-active' : ''}
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
