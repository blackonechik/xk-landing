import { CreditCard, Plus } from 'lucide-react'
import type { AccountPayload } from '@/entities/account'
import { BankCardPreview, mapBankCardToPreview } from '@/entities/bank'
import { CreateBankCardForm } from '@/features/bank/create-card'
import { SectionHeader } from '@/shared/ui/section-header'
import { SurfaceCard } from '@/shared/ui/surface-card'

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
        <SurfaceCard as="section" className="xk-bank-panel">
          <SectionHeader
            eyebrow="Новая карта"
            title="Выпуск карты"
            icon={<Plus size={28} />}
          />

          <CreateBankCardForm
            ownerNickname={account.player.nickname}
            canCreateCard={canCreateCard}
            onCreate={onCreateCard}
          />
        </SurfaceCard>

        <SurfaceCard as="section" className="xk-bank-panel">
          <SectionHeader
            eyebrow="Мои карты"
            title="Портфель карт"
            icon={<CreditCard size={28} />}
          />

          <div className="xk-bank-cards">
            {account.bank.cards.map((card) => (
              <BankCardPreview
                {...mapBankCardToPreview(card)}
                key={card.id}
                onClose={() => onCloseCard(card.id)}
              />
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  )
}
