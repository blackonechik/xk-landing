import type { ReactNode } from 'react'
import { LandingButton } from '@/shared/ui/landing-button'

type ActionButtonItem = {
  href: string
  label: ReactNode
  tone: 'success' | 'primary' | 'default'
  size?: 'small' | 'base' | 'large'
  className?: string
}

type ActionButtonsProps = {
  items: ActionButtonItem[]
  className?: string
}

export function ActionButtons({ items, className }: ActionButtonsProps) {
  return (
    <div
      className={['xk-cabinet-actions', className].filter(Boolean).join(' ')}
    >
      {items.map((item) => (
        <LandingButton
          key={item.href}
          href={item.href}
          tone={item.tone}
          size={item.size ?? 'small'}
          arrow
          className={['xk-cabinet-cta', 'xk-cabinet-cta_small', item.className]
            .filter(Boolean)
            .join(' ')}
        >
          {item.label}
        </LandingButton>
      ))}
    </div>
  )
}
