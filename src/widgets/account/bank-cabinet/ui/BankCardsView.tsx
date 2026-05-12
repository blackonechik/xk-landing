import { Card } from '@heroui/react'
import { CreditCard, Plus } from 'lucide-react'
import type { AccountPayload } from '@/entities/account'
import { BankCardPreview, mapBankCardToPreview } from '@/entities/bank'
import { CreateBankCardForm } from '@/features/bank/create-card'

type BankCardsViewProps = {
  account: AccountPayload
  canCreateCard: boolean
  onCreateCard: (payload: { title: string; design: string }) => Promise<void>
  onCloseCard: (cardId: string) => Promise<void>
}

export function BankCardsView({
  account,
  canCreateCard,
  onCreateCard,
  onCloseCard,
}: BankCardsViewProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <Card.Header className="flex items-start justify-between gap-4">
          <div>
            <Card.Title>Выпуск карты</Card.Title>
            <Card.Description>
              Новая карта для переводов и баланса.
            </Card.Description>
          </div>
          <Plus className="size-6 text-muted" />
        </Card.Header>
        <Card.Content>
          <CreateBankCardForm
            ownerNickname={account.player.nickname}
            canCreateCard={canCreateCard}
            onCreate={onCreateCard}
          />
        </Card.Content>
      </Card>

      <Card>
        <Card.Header className="flex items-start justify-between gap-4">
          <div>
            <Card.Title>Портфель карт</Card.Title>
            <Card.Description>Активные карты аккаунта.</Card.Description>
          </div>
          <CreditCard className="size-6 text-muted" />
        </Card.Header>
        <Card.Content>
          <div className="grid gap-4 md:grid-cols-2">
            {account.bank.cards.map((card) => (
              <BankCardPreview
                {...mapBankCardToPreview(card)}
                key={card.id}
                onClose={() => onCloseCard(card.id)}
              />
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}
