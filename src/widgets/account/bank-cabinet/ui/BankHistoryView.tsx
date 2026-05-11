import { History } from 'lucide-react'
import type { BankTransfer } from '@/entities/bank'

type BankHistoryViewProps = {
  transfers: BankTransfer[]
}

export function BankHistoryView({ transfers }: BankHistoryViewProps) {
  return (
    <div className="xk-bank-stack">
      <section className="xk-bank-panel">
        <div className="xk-panel-heading">
          <div>
            <p className="xk-overline">История</p>
            <h2>Последние переводы</h2>
          </div>
          <History size={28} />
        </div>

        <div className="xk-history-list">
          {transfers.map((transfer) => (
            <div className="xk-transfer-row" key={transfer.id}>
              <span>
                {transfer.fromOwner} → {transfer.toOwner}
              </span>
              <strong>{transfer.amountDiamonds} алм.</strong>
            </div>
          ))}
          {transfers.length === 0 ? (
            <p className="xk-muted">Пока нет переводов.</p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
