import { Card, Chip, Text } from '@heroui/react'
import {
  Construction,
  Gem,
  HeartPulse,
  Landmark,
  ScrollText,
  UserRound,
} from 'lucide-react'
import type { AccountPayload } from '@/entities/account'
import { formatDate } from '@/shared/lib/date/format-date'
import AnimatedLink from '@/components/AnimatedLink'
import { HeroMetricCard } from '@/shared/ui/hero-page'

type ProfileStatusPanelProps = {
  account: AccountPayload
  totalDiamonds: number
}

export function ProfileStatusPanel({
  account,
  totalDiamonds,
}: ProfileStatusPanelProps) {
  const sections = [
    {
      href: '/rules',
      icon: <ScrollText size={22} />,
      title: 'Правила',
      description: 'Открой актуальные правила, ограничения и уточнения.',
    },
    {
      href: '/cabinet/bank',
      icon: <Landmark size={22} />,
      title: 'Банк',
      description: 'Переводы, карты и управление алмазами в одном месте.',
    },
    {
      icon: <Construction size={22} />,
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
        <div className="grid gap-4 md:grid-cols-2">
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
            value={formatDate(account.player.lastLoginAt)}
            icon={<ScrollText size={18} />}
          />
          <HeroMetricCard
            label="Алмазы на картах"
            value={totalDiamonds}
            icon={<Gem size={18} />}
          />
        </div>

        <Card.Title>Быстрые разделы:</Card.Title>

        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section) =>
            'href' in section ? (
              <AnimatedLink
                key={section.title}
                className="block"
                to={section.href}
              >
                <Card className="h-full" variant="secondary">
                  <div className="text-muted">{section.icon}</div>
                  <Card.Header>
                    <Card.Title>{section.title}</Card.Title>
                    <Card.Description>{section.description}</Card.Description>
                  </Card.Header>
                </Card>
              </AnimatedLink>
            ) : (
              <Card key={section.title} className="h-full" variant="secondary">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-muted">{section.icon}</div>
                  <Chip variant="soft">{section.badge}</Chip>
                </div>
                <Card.Header>
                  <Card.Title>{section.title}</Card.Title>
                  <Card.Description>{section.description}</Card.Description>
                </Card.Header>
              </Card>
            ),
          )}
        </div>
      </Card.Content>
    </Card>
  )
}
