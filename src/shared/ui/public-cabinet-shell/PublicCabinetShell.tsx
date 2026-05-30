import type { ReactNode } from 'react'
import { PageHeader } from '@/shared/ui/page-header'

type PublicCabinetShellProps = {
  eyebrow?: string
  title: string
  description?: ReactNode
  actions?: ReactNode
  children: ReactNode
}

export function PublicCabinetShell({
  eyebrow,
  title,
  description,
  actions,
  children,
}: PublicCabinetShellProps) {
  return (
    <main className="xk-hero-scope min-h-svh bg-background pt-[var(--xk-header-height)] text-foreground">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pb-6 lg:pt-[18px]">
        <div className="mx-auto flex w-full flex-col gap-8">
          <PageHeader
            actions={actions}
            description={description}
            eyebrow={eyebrow}
            title={title}
          />
          {children}
        </div>
      </section>
    </main>
  )
}