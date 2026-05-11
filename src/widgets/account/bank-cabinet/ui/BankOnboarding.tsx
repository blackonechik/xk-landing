import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { AccountPayload } from '@/entities/account'
import { CreateBankCardForm } from '@/features/bank/create-card'
import { LandingButton } from '@/shared/ui/landing-button'
import { SectionHeader } from '@/shared/ui/section-header'
import { SurfaceCard } from '@/shared/ui/surface-card'

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
    <section className="xk-bank-onboarding">
      <SurfaceCard className="xk-bank-onboarding__copy">
        <p className="xk-overline">Первый шаг</p>
        <h2>Добро пожаловать в банк</h2>
        <p>
          У вас еще нет банковских карт. Нажмите кнопку, чтобы оформить первую
          карту и открыть доступ к балансу, переводам и истории операций.
        </p>
        {!isCreating ? (
          <div className="xk-bank-onboarding__action">
            <LandingButton
              as="button"
              type="button"
              tone="success"
              size="small"
              arrow
              onClick={() => setIsCreating(true)}
            >
              Оформить первую карту
            </LandingButton>
          </div>
        ) : null}
      </SurfaceCard>
      {isCreating ? (
        <SurfaceCard as="section" className="xk-bank-panel">
          <SectionHeader
            eyebrow="Новая карта"
            title="Оформление"
            icon={<Plus size={28} />}
          />

          <CreateBankCardForm
            ownerNickname={account.player.nickname}
            canCreateCard={canCreateCard}
            showOwnerField
            submitLabel="Выпустить карту"
            onCreate={onCreateCard}
          />
        </SurfaceCard>
      ) : null}
    </section>
  )
}
