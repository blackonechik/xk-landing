import { CreditCard, Diamond, History, Send } from 'lucide-react'
import type { AccountPayload } from '@/entities/account'
import { InfoTile } from '@/shared/ui/info-tile'

type BankSummaryProps = {
  account: AccountPayload
  totalDiamonds: number
}

export function BankSummary({ account, totalDiamonds }: BankSummaryProps) {
  return (
    <div className="xk-bank-summary">
      <InfoTile
        className="xk-bank-summary__item"
        icon={<Diamond size={22} />}
        label="Баланс на картах"
        value={`${totalDiamonds} алмазов`}
      />
      <InfoTile
        className="xk-bank-summary__item"
        icon={<CreditCard size={22} />}
        label="Карты"
        value={`${account.bank.cards.length}/${account.bank.limits.maxCardsPerPlayer}`}
      />
      <InfoTile
        className="xk-bank-summary__item"
        icon={<Send size={22} />}
        label="Перевод за раз"
        value={`${account.bank.limits.maxTransferDiamonds} алм.`}
      />
      <InfoTile
        className="xk-bank-summary__item"
        icon={<History size={22} />}
        label="Дневной лимит"
        value={`${account.bank.limits.dailyTransferDiamondsLimit} алм.`}
      />
    </div>
  )
}
