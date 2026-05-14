import { Button, Card, Chip, EmptyState, Text } from '@heroui/react'
import {
  ArrowRight,
  Archive,
  Brush,
  CreditCard,
  Frown,
  HandCoins,
  Plus,
  ReceiptText,
  ShieldCheck,
  Store,
} from 'lucide-react'
import { useState } from 'react'
import type { AccountPayload } from '@/entities/account'
import { CreateBankCardForm } from '@/features/bank/create-card'

type BankOnboardingProps = {
  account: AccountPayload
  canCreateCard: boolean
  onCreateCard: (payload: { title: string; design: string }) => Promise<void>
}

const bankBenefits = [
  {
    title: 'Надежное хранение',
    description: 'Безопасное место для ваших алмазов и финансовых операций.',
    icon: ShieldCheck,
  },
  {
    title: 'Быстрые переводы',
    description: 'Мгновенные переводы между игроками по нику или номеру карты.',
    icon: HandCoins,
  },
  {
    title: 'Свободный инвентарь',
    description: 'Меньше предметов в руках, больше места для игры.',
    icon: Archive,
  },
  {
    title: 'Финансовый контроль',
    description: 'История операций, лимиты и статистика переводов в одном месте.',
    icon: ReceiptText,
  },
  {
    title: 'Офлайн-торговля',
    description: 'Платежи и сделки остаются удобными даже без личной встречи.',
    icon: Store,
  },
  {
    title: 'Стильный дизайн',
    description: 'Выберите оформление карты под свой игровой образ.',
    icon: Brush,
  },
]

export function BankOnboarding({
  account,
  canCreateCard,
  onCreateCard,
}: BankOnboardingProps) {
  const [isCreating, setIsCreating] = useState(false)

  return (
    <section className="grid items-start gap-6 xl:grid-cols-[minmax(280px,0.72fr)_minmax(420px,1fr)]">
      <Card className="overflow-hidden">
        <Card.Content className="grid gap-6 p-6 sm:p-8">
          <EmptyState className="grid justify-items-start gap-5">
            <div
              className="flex justify-center w-full"
              aria-hidden="true"
            >
              <Frown size={72} strokeWidth={1.5} />
            </div>

            <div className="grid justify-items-start gap-3">
              <Chip color="accent" variant="soft">
                <CreditCard size={14} />
                Банковская карта
              </Chip>
              <Card.Title>У вас все еще нет банковской карты...</Card.Title>
              <Text className="max-w-xl leading-7" color="muted">
                Чтобы начать работать с банком, пожалуйста, оформите первую
                банковскую карту.
              </Text>
            </div>
          </EmptyState>
        </Card.Content>
        {!isCreating ? (
          <Card.Footer className="px-6 pb-6 sm:px-8 sm:pb-8">
            <Button
              className="min-h-14 w-full"
              size="lg"
              onPress={() => setIsCreating(true)}
            >
              Оформить первую карту
              <ArrowRight size={18} />
            </Button>
          </Card.Footer>
        ) : null}
      </Card>

      <div className="grid gap-5">
        <div className="grid gap-3">
          <Text className="text-3xl font-bold leading-tight sm:text-4xl" type="h2">
            Оформив банковскую карту, вы получите:
          </Text>
          <Text className="max-w-2xl leading-7" color="muted">
            Карта открывает быстрые переводы, учет операций и удобное хранение
            алмазов без лишней возни.
          </Text>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {bankBenefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <Card
                className="min-h-32"
                key={benefit.title}
                variant="secondary"
              >
                <Card.Content className="flex h-full items-start gap-4">
                  <span
                    className="grid size-11 shrink-0 place-items-center rounded-lg border border-[var(--separator)] bg-[var(--surface)]"
                    aria-hidden="true"
                  >
                    <Icon size={22} />
                  </span>
                  <div className="min-w-0">
                    <Card.Title>{benefit.title}</Card.Title>
                    <Card.Description className="mt-1 leading-6">
                      {benefit.description}
                    </Card.Description>
                  </div>
                </Card.Content>
              </Card>
            )
          })}
        </div>
      </div>

      {isCreating ? (
        <Card className="xl:col-span-2">
          <Card.Header className="flex items-start justify-between gap-4">
            <div>
              <Card.Title>Оформление</Card.Title>
              <Card.Description>Новая карта</Card.Description>
            </div>
            <Plus className="size-6 text-muted" />
          </Card.Header>
          <Card.Content>
            <CreateBankCardForm
              ownerNickname={account.player.nickname}
              canCreateCard={canCreateCard}
              showOwnerField
              submitLabel="Выпустить карту"
              onCreate={onCreateCard}
            />
          </Card.Content>
        </Card>
      ) : null}
    </section>
  )
}
