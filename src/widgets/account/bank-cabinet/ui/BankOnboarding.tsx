import { Plus } from 'lucide-react'
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
  return (
    <section className="xk-bank-onboarding">
      <div className="xk-bank-onboarding__copy">
        <p className="xk-overline">Первый шаг</p>
        <h2>Выпустите карту</h2>
        <p>
          После выпуска откроются баланс, переводы и история операций. Имя
          владельца на карте берётся из вашего Minecraft-профиля.
        </p>
      </div>
      <section className="xk-bank-panel">
        <div className="xk-panel-heading">
          <div>
            <p className="xk-overline">Новая карта</p>
            <h2>Оформление</h2>
          </div>
          <Plus size={28} />
        </div>

        <CreateBankCardForm
          ownerNickname={account.player.nickname}
          canCreateCard={canCreateCard}
          showOwnerField
          submitLabel="Выпустить карту"
          onCreate={onCreateCard}
        />
      </section>
    </section>
  )
}
