import type { ReactNode } from 'react'
import { Card, Text } from '@heroui/react'

const heroSectionCardGradients = {
  lime: 'radial-gradient(ellipse 82% 78% at 100% 100%, rgba(178, 255, 0, 0.25) 0%, rgba(178, 255, 0, 0.1) 32%, transparent 70%)',
  emerald:
    'radial-gradient(ellipse 82% 78% at 100% 100%, rgba(16, 185, 129, 0.24) 0%, rgba(16, 185, 129, 0.09) 34%, transparent 70%)',
  sky: 'radial-gradient(ellipse 82% 78% at 100% 100%, rgba(56, 189, 248, 0.25) 0%, rgba(56, 189, 248, 0.09) 34%, transparent 70%)',
  violet:
    'radial-gradient(ellipse 82% 78% at 100% 100%, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.09) 34%, transparent 70%)',
  rose: 'radial-gradient(ellipse 82% 78% at 100% 100%, rgba(244, 63, 94, 0.24) 0%, rgba(244, 63, 94, 0.09) 34%, transparent 70%)',
  amber:
    'radial-gradient(ellipse 82% 78% at 100% 100%, rgba(245, 158, 11, 0.27) 0%, rgba(245, 158, 11, 0.1) 34%, transparent 70%)',
  ember:
    'radial-gradient(ellipse 82% 78% at 100% 100%, rgba(249, 115, 22, 0.27) 0%, rgba(249, 115, 22, 0.1) 34%, transparent 70%)',
  aqua: 'radial-gradient(ellipse 82% 78% at 100% 100%, rgba(34, 211, 238, 0.25) 0%, rgba(34, 211, 238, 0.09) 34%, transparent 70%)',
} as const

export type HeroSectionCardGradient = keyof typeof heroSectionCardGradients

type HeroSectionCardBaseProps = {
  icon?: ReactNode
  children?: ReactNode
  gradient: HeroSectionCardGradient
}

type HeroSectionCardTitleProps = {
  title: ReactNode
  description?: ReactNode
  label?: never
  value?: never
}

type HeroSectionCardMetricProps = {
  label: ReactNode
  value: ReactNode
  title?: never
  description?: never
}

type HeroSectionCardProps = HeroSectionCardBaseProps &
  (HeroSectionCardTitleProps | HeroSectionCardMetricProps)

export function HeroSectionCard({
  icon,
  children,
  gradient,
  ...contentProps
}: HeroSectionCardProps) {
  const titleContent =
    'title' in contentProps ? (
      <>
        <Card.Title>{contentProps.title}</Card.Title>
        {contentProps.description ? (
          <Card.Description>{contentProps.description}</Card.Description>
        ) : null}
      </>
    ) : (
      <>
        <Card.Description>{contentProps.label}</Card.Description>
        <Text className="mt-1" type="h4">
          {contentProps.value}
        </Text>
      </>
    )

  return (
    <Card className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: heroSectionCardGradients[gradient] }}
      />
      <Card.Header className="relative z-10 flex items-center gap-2 flex-row h-full">
        {icon ? <div className="text-muted">{icon}</div> : null}
        <div>{titleContent}</div>
      </Card.Header>
      {children ? (
        <Card.Content className="relative z-10">{children}</Card.Content>
      ) : null}
    </Card>
  )
}
