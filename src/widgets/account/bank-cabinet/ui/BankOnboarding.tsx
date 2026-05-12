import { Button, Card, Text } from '@heroui/react'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { AccountPayload } from '@/entities/account'
import { CreateBankCardForm } from '@/features/bank/create-card'

type BankOnboardingProps = {
  account: AccountPayload
  canCreateCard: boolean
  onCreateCard: (payload: { title: string; design: string }) => Promise<void>
}

export function BankOnboarding({
  account,
  canCreateCard,
  onCreateCard,
}: BankOnboardingProps) {
  const [isCreating, setIsCreating] = useState(false)

  return (
    <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <Card.Header>
          <Card.Title>Добро пожаловать в банк</Card.Title>
          <Card.Description>Первый шаг</Card.Description>
        </Card.Header>
        <Card.Content>
          <Text color="muted">
            У вас еще нет банковских карт. Нажмите кнопку, чтобы оформить первую
            карту и открыть доступ к балансу, переводам и истории операций.
          </Text>
        </Card.Content>
        {!isCreating ? (
          <Card.Footer>
            <Button onPress={() => setIsCreating(true)}>
              Оформить первую карту
            </Button>
          </Card.Footer>
        ) : null}
      </Card>
      {isCreating ? (
        <Card>
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
