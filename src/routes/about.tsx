import { createFileRoute } from '@tanstack/react-router'
import { Card, Text } from '@heroui/react'
import { HeroLinkButton, HeroPage } from '@/shared/ui/hero-page'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      {
        title: 'О сервере | XK HARDCORE',
      },
    ],
  }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <HeroPage
      eyebrow="О сервере"
      title="XK HARDCORE не про быстрый запуск, а про долгую историю"
      description="Приватный Minecraft RolePlay сервер, где важны игроки, союзы, конфликты, города и государства."
      actions={
        <>
          <HeroLinkButton to="/rules" variant="secondary">
            Правила
          </HeroLinkButton>
          <HeroLinkButton to="/payment">Оплата</HeroLinkButton>
        </>
      }
      narrow
    >
      <Card>
        <Card.Header>
          <Card.Title>Идея проекта</Card.Title>
          <Card.Description>
            Живой RP-мир вместо магазина привилегий.
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-4">
          <Text.Paragraph>
            Это приватный Minecraft RolePlay сервер, вдохновлённый форматом
            Dream SMP. В центре не магазин привилегий, а сами игроки, их союзы,
            конфликты, города и государства.
          </Text.Paragraph>
          <Text.Paragraph>
            Мы строим мир, в котором архитектура, дипломатия, амбиции и личные
            решения имеют больший вес, чем донатные функции. Именно поэтому XK
            HARDCORE задуман как долгий сервер, а не краткосрочный проект.
          </Text.Paragraph>
        </Card.Content>
      </Card>
    </HeroPage>
  )
}
