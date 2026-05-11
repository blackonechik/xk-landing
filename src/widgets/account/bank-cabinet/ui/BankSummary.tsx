import { CreditCard, Diamond, History, Send } from 'lucide-react'
import type { AccountPayload } from '@/entities/account'

type BankSummaryProps = {
  account: AccountPayload
  totalDiamonds: number
}

export function BankSummary({ account, totalDiamonds }: BankSummaryProps) {
  return (
    <div className="xk-bank-summary">
      <div className="xk-bank-summary__item">
        <Diamond size={22} />
        <div>
          <span>Баланс на картах</span>
          <strong>{totalDiamonds} алмазов</strong>
        </div>
      </div>
      <div className="xk-bank-summary__item">
        <CreditCard size={22} />
        <div>
          <span>Карты</span>
          <strong>
            {account.bank.cards.length}/{account.bank.limits.maxCardsPerPlayer}
          </strong>
        </div>
      </div>
      <div className="xk-bank-summary__item">
        <Send size={22} />
        <div>
          <span>Перевод за раз</span>
          <strong>{account.bank.limits.maxTransferDiamonds} алм.</strong>
        </div>
      </div>
      <div className="xk-bank-summary__item">
        <History size={22} />
        <div>
          <span>Дневной лимит</span>
          <strong>{account.bank.limits.dailyTransferDiamondsLimit} алм.</strong>
        </div>
      </div>
    </div>
  )
}
