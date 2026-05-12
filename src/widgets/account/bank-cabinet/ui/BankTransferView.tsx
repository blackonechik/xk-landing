import { Card } from '@heroui/react'
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
    <Card>
      <Card.Header className="flex items-start justify-between gap-4">
        <div>
          <Card.Title>Отправить алмазы</Card.Title>
          <Card.Description>
            Перевод по нику игрока или номеру карты.
          </Card.Description>
        </div>
        <Send className="size-6 text-muted" />
      </Card.Header>
      <Card.Content>
        <TransferDiamondsForm account={account} onTransfer={onTransfer} />
      </Card.Content>
    </Card>
  )
}
