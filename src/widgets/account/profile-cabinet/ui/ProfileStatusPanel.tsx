import type { CSSProperties, ReactNode } from 'react'
import { Card, Chip, Text } from '@heroui/react'
import {
  Construction,
  Gem,
  HeartPulse,
  Landmark,
  ScrollText,
  UserRound,
} from 'lucide-react'
import AnimatedLink from '@/components/AnimatedLink'
import type { AccountPayload } from '@/entities/account'
import { formatLastSeen } from '@/shared/lib/date/format-date'
import { HeroMetricCard } from '@/shared/ui/hero-page'

type ProfileStatusPanelProps = {
  account: AccountPayload
  totalDiamonds: number
}

type QuickSectionCardProps = {
  accent: string
  description: string
  href?: string
  icon: ReactNode
  mockLabel: string
  title: string
  badge?: string
  meta: string
}

function QuickSectionCard({
  accent,
  description,
  href,
  icon,
  mockLabel,
  title,
  badge,
  meta,
}: QuickSectionCardProps) {
  const content = (
    <Card
      className="group h-full overflow-hidden border border-white/8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.24)]"
      style={
        {
          '--accent': accent,
          backgroundImage:
            'linear-gradient(180deg, color-mix(in srgb, var(--accent) 15%, transparent) 0%, color-mix(in srgb, var(--accent) 5%, transparent) 100%)',
        } as CSSProperties
      }
      variant="secondary"
    >
      <div className="flex h-full flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5">
        <div
          className="flex aspect-square w-full shrink-0 items-end overflow-hidden rounded-2xl border border-white/10 shadow-[0_16px_32px_rgba(0,0,0,0.18)] sm:w-[128px]"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--accent) 84%, white 16%) 0%, color-mix(in srgb, var(--accent) 72%, black 28%) 100%)',
          }}
        >
          <div className="flex h-full w-full flex-col justify-between p-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-3 rounded-full bg-white/30" />
              <div className="h-2 w-8 rounded-full bg-white/20" />
            </div>
            <div className="grid gap-1">
              <div className="h-2 w-3/4 rounded-full bg-white/20" />
              <div className="h-2 w-1/2 rounded-full bg-white/20" />
            </div>
            <div className="flex items-end justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/85">
                {mockLabel}
              </span>
              <span className="text-[10px] text-white/60">mock</span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:scale-105"
              style={{
                background:
                  'linear-gradient(180deg, color-mix(in srgb, var(--accent) 82%, white 18%) 0%, var(--accent) 100%)',
                boxShadow: '0 12px 28px color-mix(in srgb, var(--accent) 30%, transparent)',
              }}
            >
              {icon}
            </div>

            {badge ? (
              <Chip
                className="border border-white/12 bg-black/20 text-[10px] uppercase tracking-[0.08em] text-foreground"
                variant="soft"
              >
                {badge}
              </Chip>
            ) : (
              <Chip
                className="border border-white/12 bg-black/20 text-[10px] uppercase tracking-[0.08em] text-foreground"
                variant="soft"
              >
                {meta}
              </Chip>
            )}
          </div>

          <Card.Header className="gap-1 p-0">
            <Card.Title className="pr-8">{title}</Card.Title>
            <Card.Description>{description}</Card.Description>
          </Card.Header>

          <Card.Footer className="mt-auto flex w-full items-center justify-between gap-3 p-0">
            <span className="text-xs font-medium text-muted">{meta}</span>
            <span className="text-sm font-semibold text-foreground/90 transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Card.Footer>
        </div>
      </div>
    </Card>
  )

  if (!href) {
    return content
  }

  return (
    <AnimatedLink className="block h-full" to={href}>
      {content}
    </AnimatedLink>
  )
}

export function ProfileStatusPanel({
  account,
  totalDiamonds,
}: ProfileStatusPanelProps) {
  const sections = [
    {
      href: '/rules',
      accent: '#85ad71',
      icon: <ScrollText size={22} />,
      mockLabel: 'rules art',
      title: 'Правила',
      description: 'Открой актуальные правила, ограничения и уточнения.',
    },
    {
      href: '/cabinet/bank',
      accent: '#b59355',
      icon: <Landmark size={22} />,
      mockLabel: 'bank art',
      title: 'Банк',
      description: 'Переводы, карты и управление алмазами в одном месте.',
    },
    {
      accent: '#4f7d86',
      icon: <Construction size={22} />,
      mockLabel: 'kingdoms art',
      title: 'Королевства',
      description: 'Раздел находится в разработке и появится чуть позже.',
      badge: 'В разработке',
    },
  ] as const

  return (
    <Card>
      <Card.Header className="flex items-start justify-between gap-4">
        <Card.Title>Ваш аккаунт:</Card.Title>
      </Card.Header>
      <Card.Content className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-4">
          <HeroMetricCard
            label="Ник"
            value={account.player.nickname}
            icon={<UserRound size={18} />}
          />
          <HeroMetricCard
            label="Жизни"
            value={account.player.lives}
            icon={<HeartPulse size={18} />}
          />
          <HeroMetricCard
            label="Последний вход"
            value={formatLastSeen(account.player.lastLoginAt)}
            icon={<ScrollText size={18} />}
          />
          <HeroMetricCard
            label="Алмазы"
            value={totalDiamonds}
            icon={<Gem size={18} />}
          />
        </div>

        <Card.Title>Быстрые разделы:</Card.Title>

        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <QuickSectionCard
              key={section.title}
              accent={section.accent}
              badge={section.badge}
              description={section.description}
              href={section.href}
              icon={section.icon}
              meta={section.meta}
              mockLabel={section.mockLabel}
              title={section.title}
            />
          ))}
        </div>
      </Card.Content>
    </Card>
  )
}
