import type { ReactNode } from 'react'

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  icon?: ReactNode
}

export function SectionHeader({ eyebrow, title, icon }: SectionHeaderProps) {
  return (
    <div className="xk-panel-heading">
      <div>
        {eyebrow ? <p className="xk-overline">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {icon}
    </div>
  )
}
