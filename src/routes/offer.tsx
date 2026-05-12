import { createFileRoute } from '@tanstack/react-router'
import { Card, Link, Text } from '@heroui/react'
import type { ReactNode } from 'react'
import { HeroPage } from '@/shared/ui/hero-page'

export const Route = createFileRoute('/offer')({
  head: () => ({
    meta: [
      {
        title: 'Публичная оферта | XK HARDCORE',
      },
      {
        name: 'description',
        content:
          'Условия оплаты, получения цифровых услуг и контакты XK HARDCORE.',
      },
    ],
  }),
  component: OfferPage,
})

function OfferPage() {
  return (
    <HeroPage
      eyebrow="Документы"
      title="Публичная оферта XK HARDCORE"
      description="Этот документ описывает условия оплаты цифровых услуг на сайте XK HARDCORE: проходки на приватный Minecraft сервер и дополнительной RP-жизни."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <LegalCard title="Исполнитель">
          <Text.Paragraph>
            Самозанятый: Сурнин Владислав Владимирович.
          </Text.Paragraph>
          <Text.Paragraph>ИНН: 233711467280.</Text.Paragraph>
          <Text.Paragraph>
            Email:{' '}
            <Link href="mailto:surnin.vladislav@gmail.com">
              surnin.vladislav@gmail.com
            </Link>
            .
          </Text.Paragraph>
          <Text.Paragraph>
            Telegram:{' '}
            <Link href="https://t.me/blackonechik">@blackonechik</Link>.
          </Text.Paragraph>
          <Text.Paragraph>
            Телефон: <Link href="tel:+79186618809">+7 918 661-88-09</Link>.
          </Text.Paragraph>
          <Text.Paragraph>
            Почтовый адрес: г. Анапа, ул. Ленина 180А.
          </Text.Paragraph>
        </LegalCard>

        <LegalCard title="Товары и услуги">
          <Text.Paragraph>
            Проходка на XK HARDCORE: цифровая услуга по предоставлению доступа к
            приватному серверу и автоматическому добавлению указанного никнейма
            в whitelist после успешной оплаты. Цена: 200 руб.
          </Text.Paragraph>
          <Text.Paragraph>
            Дополнительная RP-жизнь: цифровая услуга по начислению одной
            дополнительной RP-жизни активному игроку текущего сезона после
            подтверждения администратором. Цена: 200 руб.
          </Text.Paragraph>
        </LegalCard>

        <LegalCard title="Оплата и получение заказа">
          <Text.Paragraph>
            При оформлении заказа игрок указывает никнейм Minecraft и выбранную
            цифровую услугу. После успешной оплаты игрок пишет администратору в
            Telegram <Link href="https://t.me/blackonechik">@blackonechik</Link>
            , указывает ID заказа и никнейм для активации услуги.
          </Text.Paragraph>
          <Text.Paragraph>
            Физическая доставка не требуется: заказ предоставляется внутри
            игрового сервера после проверки платежа и сообщения игрока
            администратору.
          </Text.Paragraph>
        </LegalCard>

        <LegalCard title="Условия использования">
          <Text.Paragraph>
            Игрок обязуется указывать достоверный никнейм и соблюдать правила
            сервера. Оплата не даёт права нарушать правила XK HARDCORE или
            получать игровые преимущества, не указанные в описании услуги.
          </Text.Paragraph>
          <Text.Paragraph>
            Если услугу невозможно предоставить по технической причине или из-за
            ошибки в заказе, вопрос решается через Telegram администратора,
            контактный email или телефон.
          </Text.Paragraph>
        </LegalCard>
      </div>
    </HeroPage>
  )
}

function LegalCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-3">{children}</Card.Content>
    </Card>
  )
}
