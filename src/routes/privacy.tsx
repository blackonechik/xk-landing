import { createFileRoute } from '@tanstack/react-router'
import { Card, Link, Text } from '@heroui/react'
import type { ReactNode } from 'react'
import { HeroPage } from '@/shared/ui/hero-page'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      {
        title: 'Политика обработки персональных данных | XK HARDCORE',
      },
      {
        name: 'description',
        content:
          'Политика обработки персональных данных пользователей сайта XK HARDCORE.',
      },
    ],
  }),
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <HeroPage
      eyebrow="Документы"
      title="Политика обработки персональных данных"
      description="Настоящая политика описывает, какие персональные данные обрабатывает XK HARDCORE при оформлении цифровых услуг и как пользователь может обратиться по вопросам обработки данных."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <LegalCard title="Оператор">
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

        <LegalCard title="Какие данные обрабатываются">
          <Text.Paragraph>
            При оформлении заказа пользователь передает никнейм Minecraft,
            выбранную услугу, промокод при наличии, сведения о статусе заказа и
            платежа.
          </Text.Paragraph>
          <Text.Paragraph>
            Также могут обрабатываться технические данные, необходимые для
            работы сайта и защиты от ошибок: дата и время обращения, сетевые
            идентификаторы, данные браузера и устройства.
          </Text.Paragraph>
        </LegalCard>

        <LegalCard title="Цели обработки">
          <Text.Paragraph>
            Данные используются для создания заказа, приема оплаты, активации
            цифровой услуги на сервере, поддержки, учета платежей и исполнения
            обязанностей по закону.
          </Text.Paragraph>
          <Text.Paragraph>
            Правовые основания обработки: согласие пользователя, исполнение
            договора и публичной оферты, а также требования законодательства РФ.
          </Text.Paragraph>
        </LegalCard>

        <LegalCard title="Действия с данными">
          <Text.Paragraph>
            Оператор может собирать, записывать, систематизировать, хранить,
            уточнять, использовать, передавать платежному провайдеру,
            блокировать, удалять и уничтожать персональные данные.
          </Text.Paragraph>
          <Text.Paragraph>
            Данные не публикуются в открытом доступе и не используются для
            рассылок.
          </Text.Paragraph>
        </LegalCard>

        <LegalCard title="Сроки хранения">
          <Text.Paragraph>
            Данные хранятся до достижения целей обработки, отзыва согласия
            пользователем или истечения сроков хранения, предусмотренных
            законодательством и учетными обязанностями оператора.
          </Text.Paragraph>
          <Text.Paragraph>
            Если пользователь отзывает согласие, часть данных может быть
            сохранена, когда это необходимо для исполнения закона, учета
            платежей, разрешения споров или защиты прав оператора.
          </Text.Paragraph>
        </LegalCard>

        <LegalCard title="Права пользователя">
          <Text.Paragraph>
            Пользователь может запросить сведения об обработке персональных
            данных, уточнение, блокирование, удаление данных или отозвать
            согласие, направив обращение на email оператора.
          </Text.Paragraph>
          <Text.Paragraph>
            По вопросам обработки персональных данных пишите на{' '}
            <Link href="mailto:surnin.vladislav@gmail.com">
              surnin.vladislav@gmail.com
            </Link>{' '}
            или в Telegram{' '}
            <Link href="https://t.me/blackonechik">@blackonechik</Link>.
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
