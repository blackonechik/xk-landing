import type { ReactNode } from 'react'
import { Link, buttonVariants } from '@heroui/react'
import AnimatedLink from '@/components/AnimatedLink'
import { PageHeader } from '@/shared/ui/page-header'

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
  params?: Record<string, string>
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
        <PageHeader
          actions={actions}
          description={description}
          eyebrow={eyebrow}
          title={title}
        />
        {children}
      </section>
    </main>
  )
}

export function HeroLinkButton({
  children,
  to,
  params,
  href,
  variant = 'primary',
  size = 'md',
  className,
}: HeroLinkButtonProps) {
  const buttonClassName = buttonVariants({ variant, size, className })

  if (to) {
    return (
      <AnimatedLink className={buttonClassName} params={params} to={to}>
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
