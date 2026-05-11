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
    <div className="xk-bank-grid xk-bank-grid_single">
      <div className="xk-bank-stack">
        <section className="xk-bank-panel">
          <div className="xk-panel-heading">
            <div>
              <p className="xk-overline">Новая карта</p>
              <h2>Выпуск карты</h2>
            </div>
            <Plus size={28} />
          </div>

          <CreateBankCardForm
            ownerNickname={account.player.nickname}
            canCreateCard={canCreateCard}
            onCreate={onCreateCard}
          />
        </section>

        <section className="xk-bank-panel">
          <div className="xk-panel-heading">
            <div>
              <p className="xk-overline">Мои карты</p>
              <h2>Портфель карт</h2>
            </div>
            <CreditCard size={28} />
          </div>

          <div className="xk-bank-cards">
            {account.bank.cards.map((card) => (
              <BankCardPreview
                {...mapBankCardToPreview(card)}
                key={card.id}
                onClose={() => onCloseCard(card.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
