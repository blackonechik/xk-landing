import { createFileRoute } from '@tanstack/react-router'
import { Card, Link, Text } from '@heroui/react'
import type { ReactNode } from 'react'
import { HeroPage } from '@/shared/ui/hero-page'

export const Route = createFileRoute('/personal-data-consent')({
  head: () => ({
    meta: [
      {
        title: 'Согласие на обработку персональных данных | XK HARDCORE',
      },
      {
        name: 'description',
        content:
          'Согласие пользователя XK HARDCORE на обработку персональных данных.',
      },
    ],
  }),
  component: PersonalDataConsentPage,
})

function PersonalDataConsentPage() {
  return (
    <HeroPage
      eyebrow="Документы"
      title="Согласие на обработку персональных данных"
      description="Заполняя форму оплаты на сайте XK HARDCORE и отмечая согласие, пользователь свободно, своей волей и в своем интересе дает согласие оператору на обработку персональных данных."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <LegalCard title="Кому дается согласие">
          <Text.Paragraph>
            Оператор: самозанятый Сурнин Владислав Владимирович.
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
            Почтовый адрес: г. Анапа, ул. Ленина 180А.
          </Text.Paragraph>
        </LegalCard>

        <LegalCard title="Какие данные">
          <Text.Paragraph>
            Пользователь соглашается на обработку никнейма Minecraft, выбранной
            цифровой услуги, промокода, статуса заказа и платежа, а также
            технических данных, связанных с оформлением заказа.
          </Text.Paragraph>
        </LegalCard>

        <LegalCard title="Для каких целей">
          <Text.Paragraph>
            Цели обработки: оформление заказа, прием оплаты, активация проходки
            или RP-жизни, поддержка, ведение учета и исполнение требований
            законодательства РФ.
          </Text.Paragraph>
        </LegalCard>

        <LegalCard title="Какие действия разрешены">
          <Text.Paragraph>
            Пользователь разрешает сбор, запись, систематизацию, накопление,
            хранение, уточнение, использование, передачу платежному провайдеру,
            блокирование, удаление и уничтожение персональных данных.
          </Text.Paragraph>
          <Text.Paragraph>
            Обработка может выполняться как автоматизированным, так и
            неавтоматизированным способом.
          </Text.Paragraph>
        </LegalCard>

        <LegalCard title="Срок действия">
          <Text.Paragraph>
            Согласие действует до достижения целей обработки или до его отзыва
            пользователем, если более длительное хранение не требуется по
            закону.
          </Text.Paragraph>
        </LegalCard>

        <LegalCard title="Как отозвать">
          <Text.Paragraph>
            Согласие можно отозвать письменным обращением на{' '}
            <Link href="mailto:surnin.vladislav@gmail.com">
              surnin.vladislav@gmail.com
            </Link>{' '}
            или в Telegram{' '}
            <Link href="https://t.me/blackonechik">@blackonechik</Link>. После
            получения отзыва оператор прекратит обработку данных, кроме случаев,
            когда дальнейшая обработка разрешена законом.
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
