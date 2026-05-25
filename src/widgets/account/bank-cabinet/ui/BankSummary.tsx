import { CreditCard, Diamond, History, Send } from 'lucide-react'
import type { AccountPayload } from '@/entities/account'
import { HeroSectionCard } from '@/shared/ui/hero-page'

type BankSummaryProps = {
  account: AccountPayload
  totalDiamonds: number
}

export function BankSummary({ account, totalDiamonds }: BankSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <HeroSectionCard
        gradient="aqua"
        icon={<Diamond size={22} />}
        label="Баланс на картах"
        value={`${totalDiamonds} алмазов`}
      />
      <HeroSectionCard
        gradient="violet"
        icon={<CreditCard size={22} />}
        label="Карты"
        value={`${account.bank.cards.length}/${account.bank.limits.maxCardsPerPlayer}`}
      />
      <HeroSectionCard
        gradient="amber"
        icon={<Send size={22} />}
        label="Перевод за раз"
        value={`${account.bank.limits.maxTransferDiamonds} алм.`}
      />
      <HeroSectionCard
        gradient="emerald"
        icon={<History size={22} />}
        label="Дневной лимит"
        value={`${account.bank.limits.dailyTransferDiamondsLimit} алм.`}
      />
    </div>
  )
}
