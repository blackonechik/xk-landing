import type { ReactNode } from 'react'
import { Chip, Text } from '@heroui/react'

type PublicCabinetShellProps = {
  eyebrow?: string
  title: string
  description?: ReactNode
  actions?: ReactNode
  aside?: ReactNode
  children: ReactNode
}

export function PublicCabinetShell({
  eyebrow,
  title,
  description,
  actions,
  aside,
  children,
}: PublicCabinetShellProps) {
  return (
    <main className="xk-hero-scope min-h-svh bg-background pt-[var(--xk-header-height)] text-foreground">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pb-6 lg:pt-[18px]">
        <div className={aside ? 'grid gap-3 lg:grid-cols-[minmax(260px,294px)_minmax(0,1fr)]' : 'grid'}>
          {aside ? (
            <aside className="lg:min-h-0 lg:py-[18px]">{aside}</aside>
          ) : null}

          <section className="min-w-0 lg:min-h-0 lg:py-[18px]">
            <div className="flex flex-col gap-6 rounded-[30px] border border-[var(--separator)] bg-[var(--surface)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:h-[calc(100svh-var(--xk-header-height)-36px)] lg:overflow-y-auto lg:px-[clamp(20px,3vw,34px)] lg:py-6">
              <header className="grid gap-[18px] py-2 text-foreground">
                {eyebrow ? (
                  <div>
                    <Chip color="accent" variant="soft">
                      {eyebrow}
                    </Chip>
                  </div>
                ) : null}

                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                  <div className="max-w-3xl">
                    <Text type="h1">{title}</Text>
                    {description ? (
                      <Text className="mt-3 leading-[1.65] text-muted" type="body">
                        {description}
                      </Text>
                    ) : null}
                  </div>

                  {actions ? (
                    <div className="flex flex-wrap items-center gap-3">
                      {actions}
                    </div>
                  ) : null}
                </div>
              </header>

              <div className="grid gap-6 pb-4">
                {children}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}