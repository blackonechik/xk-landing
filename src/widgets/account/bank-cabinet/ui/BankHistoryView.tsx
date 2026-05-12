import { Card, Text } from '@heroui/react'
import { History } from 'lucide-react'
import type { BankTransfer } from '@/entities/bank'

type BankHistoryViewProps = {
  transfers: BankTransfer[]
}

export function BankHistoryView({ transfers }: BankHistoryViewProps) {
  return (
    <Card>
      <Card.Header className="flex items-start justify-between gap-4">
        <div>
          <Card.Title>Последние переводы</Card.Title>
          <Card.Description>История операций по картам.</Card.Description>
        </div>
        <History className="size-6 text-muted" />
      </Card.Header>
      <Card.Content>
        <div className="grid gap-3">
          {transfers.map((transfer) => (
            <Card key={transfer.id} variant="secondary">
              <Card.Header className="flex flex-row items-center justify-between gap-4">
                <div>
                  <Card.Title>
                    {transfer.fromOwner} → {transfer.toOwner}
                  </Card.Title>
                  {transfer.comment ? (
                    <Card.Description>{transfer.comment}</Card.Description>
                  ) : null}
                </div>
                <Text weight="semibold">{transfer.amountDiamonds} алм.</Text>
              </Card.Header>
            </Card>
          ))}
          {transfers.length === 0 ? (
            <Text color="muted">Пока нет переводов.</Text>
          ) : null}
        </div>
      </Card.Content>
    </Card>
  )
}
