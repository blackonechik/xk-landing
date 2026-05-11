import { History } from 'lucide-react'
import type { BankTransfer } from '@/entities/bank'
import { InfoTile } from '@/shared/ui/info-tile'
import { SectionHeader } from '@/shared/ui/section-header'
import { SurfaceCard } from '@/shared/ui/surface-card'

type BankHistoryViewProps = {
  transfers: BankTransfer[]
}

export function BankHistoryView({ transfers }: BankHistoryViewProps) {
  return (
    <div className="xk-bank-stack">
      <SurfaceCard as="section" className="xk-bank-panel">
        <SectionHeader
          eyebrow="История"
          title="Последние переводы"
          icon={<History size={28} />}
        />

        <div className="xk-history-list">
          {transfers.map((transfer) => (
            <InfoTile
              className="xk-transfer-row"
              key={transfer.id}
              label={`${transfer.fromOwner} → ${transfer.toOwner}`}
              value={`${transfer.amountDiamonds} алм.`}
            />
          ))}
          {transfers.length === 0 ? (
            <p className="xk-muted">Пока нет переводов.</p>
          ) : null}
        </div>
      </SurfaceCard>
    </div>
  )
}
