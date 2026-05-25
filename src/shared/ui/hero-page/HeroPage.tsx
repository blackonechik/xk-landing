import type { ReactNode } from 'react'
import { Card, Chip, Link, Text, buttonVariants } from '@heroui/react'
import AnimatedLink from '@/components/AnimatedLink'

type HeroPageProps = {
  eyebrow?: string
  title: string
  description?: ReactNode
  actions?: ReactNode
  children: ReactNode
  narrow?: boolean
}

type HeroLinkButtonProps = {
  children: ReactNode
  to?: string
  href?: string
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'outline'
    | 'ghost'
    | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function HeroPage({
  eyebrow,
  title,
  description,
  actions,
  children,
  narrow = false,
}: HeroPageProps) {
  return (
    <main
      className={[
        'xk-hero-scope',
        'min-h-svh bg-background text-foreground',
        'font-sans',
        'px-4 pb-16 pt-28 sm:px-6 lg:px-8',
      ].join(' ')}
    >
      <section
        className={[
          'mx-auto flex w-full flex-col gap-8',
          narrow ? 'max-w-4xl' : 'max-w-7xl',
        ].join(' ')}
      >
        <header className="flex flex-col gap-5 items-start">
          {eyebrow ? (
            <Chip color="accent" variant="soft">
              {eyebrow}
            </Chip>
          ) : null}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Text type="h1">{title}</Text>
              {description ? (
                <Text className="mt-3 max-w-2xl" color="muted" type="body">
                  {description}
                </Text>
              ) : null}
            </div>
            {actions ? (
              <div className="flex flex-wrap items-center gap-3">{actions}</div>
            ) : null}
          </div>
        </header>
        {children}
      </section>
    </main>
  )
}

export function HeroLinkButton({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className,
}: HeroLinkButtonProps) {
  const buttonClassName = buttonVariants({ variant, size, className })

  if (to) {
    return (
      <AnimatedLink className={buttonClassName} to={to}>
        {children}
      </AnimatedLink>
    )
  }

  return (
    <a className={buttonClassName} href={href}>
      {children}
    </a>
  )
}

export function HeroInlineLink({
  children,
  href,
}: {
  children: ReactNode
  href: string
}) {
  return <Link href={href}>{children}</Link>
}
