import type { ReactNode } from 'react'
import { Card, Chip, Text } from '@heroui/react'

type PublicCabinetShellProps = {
  eyebrow?: string
  title: string
  description?: ReactNode
  actions?: ReactNode
  aside: ReactNode
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
    <main className="xk-hero-scope relative min-h-svh overflow-hidden text-white">

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-16 pt-28 sm:px-6 lg:px-8">

          <div className="grid gap-6">
            <Card className="overflow-hidden border border-white/12 bg-white/8 shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
              <Card.Content className="grid gap-6 p-6 md:p-8">
                {eyebrow ? (
                  <div>
                    <Chip color="accent" variant="soft">
                      {eyebrow}
                    </Chip>
                  </div>
                ) : null}

                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                  <div className="max-w-3xl">
                    <Text className="text-white" type="h1">
                      {title}
                    </Text>
                    {description ? (
                      <Text className="mt-3 text-white/72" type="body">
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
              </Card.Content>
            </Card>

            {children}
          </div>
      </section>
    </main>
  )
}