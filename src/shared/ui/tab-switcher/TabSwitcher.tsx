type TabSwitcherItem<T extends string> = {
  id: T
  label: string
}

type TabSwitcherProps<T extends string> = {
  activeId: T
  items: TabSwitcherItem<T>[]
  onChange: (id: T) => void
  className?: string
  ariaLabel: string
}

export function TabSwitcher<T extends string>({
  activeId,
  items,
  onChange,
  className,
  ariaLabel,
}: TabSwitcherProps<T>) {
  return (
    <div
      className={['xk-tab-switcher', className].filter(Boolean).join(' ')}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((item) => (
        <button
          className={activeId === item.id ? 'is-active' : ''}
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
