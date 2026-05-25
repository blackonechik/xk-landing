import type { ReactNode } from 'react'
import { Card } from '@heroui/react'

type AdminTableCardProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export function AdminTableCard({
  title,
  description,
  action,
  children,
}: AdminTableCardProps) {
  return (
    <Card>
      <Card.Header className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <Card.Title>{title}</Card.Title>
          {description ? (
            <Card.Description>{description}</Card.Description>
          ) : null}
        </div>
        {action}
      </Card.Header>
      <Card.Content>{children}</Card.Content>
    </Card>
  )
}
