import { Card, Chip, Text } from '@heroui/react'
import { HeroLinkButton } from '@/shared/ui/hero-page'

export function NewsSidebarPromo() {
  return (
    <Card className="border border-[var(--separator)] bg-[var(--surface)] xl:sticky xl:top-6">
      <Card.Header className="grid gap-3">
        <Chip color="warning" variant="soft">
          Реклама сервера
        </Chip>
        <Card.Title>Ищешь место для новой истории?</Card.Title>
        <Card.Description>
          XK HARDCORE собирает игроков, которые любят долгие сюжеты,
          аккуратную экономику и хардкорное выживание без суеты.
        </Card.Description>
      </Card.Header>
      <Card.Content className="grid gap-4">
        <div className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,#f59e0b_0%,#0f172a_100%)] p-5 text-white">
          <Text className="text-white/75" type="body-sm">
            Что внутри
          </Text>
          <div className="mt-3 grid gap-2">
            <Text className="text-white" type="body">
              Проходка на сервер
            </Text>
            <Text className="text-white/75" type="body-sm">
              Сюжетные посты, новости проекта и сообщество, которое реально
              живет на сервере, а не только в анонсах.
            </Text>
          </div>
        </div>

        <div className="grid gap-2">
          <HeroLinkButton to="/join" variant="secondary">
            Оставить заявку
          </HeroLinkButton>
          <HeroLinkButton to="/offer" variant="ghost">
            Что предлагает сервер
          </HeroLinkButton>
        </div>
      </Card.Content>
    </Card>
  )
}
