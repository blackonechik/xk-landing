import type { ReactNode } from 'react'

type InfoTileProps = {
  label: string
  value: ReactNode
  icon?: ReactNode
  className?: string
}

export function InfoTile({ label, value, icon, className }: InfoTileProps) {
  return (
    <div className={['xk-info-tile', className].filter(Boolean).join(' ')}>
      {icon ? <div className="xk-info-tile__icon">{icon}</div> : null}
      <div className="xk-info-tile__content">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  )
}
