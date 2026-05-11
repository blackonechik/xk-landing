import { Send } from 'lucide-react'
import type { AccountPayload } from '@/entities/account'
import { TransferDiamondsForm } from '@/features/bank/transfer-diamonds'

type BankTransferViewProps = {
  account: AccountPayload
  onTransfer: (payload: {
    fromCardId: string
    toCardNumber?: string
    toOwnerNickname?: string
    amountDiamonds: string
    comment: string
  }) => Promise<void>
}

export function BankTransferView({
  account,
  onTransfer,
}: BankTransferViewProps) {
  return (
    <div className="xk-bank-stack">
      <section className="xk-bank-panel">
        <div className="xk-panel-heading">
          <div>
            <p className="xk-overline">Перевод</p>
            <h2>Отправить алмазы</h2>
          </div>
          <Send size={28} />
        </div>

        <TransferDiamondsForm account={account} onTransfer={onTransfer} />
      </section>
    </div>
  )
}
