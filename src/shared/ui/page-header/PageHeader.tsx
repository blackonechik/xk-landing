import type { ReactNode } from 'react'
import { Chip, Text } from '@heroui/react'

type PageHeaderProps = {
  eyebrow?: string
  title: string
  description?: ReactNode
  actions?: ReactNode
  className?: string
  titleWrapClassName?: string
  actionsClassName?: string
  eyebrowClassName?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  titleWrapClassName,
  actionsClassName,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
}: PageHeaderProps) {
  return (
    <header className={['flex flex-col gap-5 items-start', className].filter(Boolean).join(' ')}>
      {eyebrow ? (
        <Chip className={eyebrowClassName} color="accent" variant="soft">
          {eyebrow}
        </Chip>
      ) : null}
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className={['max-w-3xl', titleWrapClassName].filter(Boolean).join(' ')}>
          <Text className={titleClassName} type="h1">
            {title}
          </Text>
          {description ? (
            <Text
              className={['mt-3 max-w-2xl', descriptionClassName].filter(Boolean).join(' ')}
              color="muted"
              type="body"
            >
              {description}
            </Text>
          ) : null}
        </div>
        {actions ? (
          <div className={['flex flex-wrap items-center gap-3', actionsClassName].filter(Boolean).join(' ')}>
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  )
}