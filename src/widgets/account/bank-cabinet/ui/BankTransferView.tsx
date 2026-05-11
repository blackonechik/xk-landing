import { Send } from 'lucide-react'
import type { AccountPayload } from '@/entities/account'
import { TransferDiamondsForm } from '@/features/bank/transfer-diamonds'
import { SectionHeader } from '@/shared/ui/section-header'
import { SurfaceCard } from '@/shared/ui/surface-card'

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
      <SurfaceCard as="section" className="xk-bank-panel">
        <SectionHeader
          eyebrow="Перевод"
          title="Отправить алмазы"
          icon={<Send size={28} />}
        />

        <TransferDiamondsForm account={account} onTransfer={onTransfer} />
      </SurfaceCard>
    </div>
  )
}
