import { Button, Card, Text } from '@heroui/react'
import { CreditCard, Trash2 } from 'lucide-react'
import type { BankCard } from '@/entities/bank'
import { getCardDesign } from '../model/card-designs'

type BankCardPreviewProps = {
  title: string
  ownerNickname: string
  designId: string
  cardNumber?: string
  balanceDiamonds?: number
  onClose?: () => void
}

export function BankCardPreview({
  title,
  ownerNickname,
  designId,
  cardNumber = '4408 **** **** ****',
  balanceDiamonds,
  onClose,
}: BankCardPreviewProps) {
  const design = getCardDesign(designId)

  return (
    <Card>
      <Card.Header className="flex flex-row items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <img
            className="size-10 rounded-md object-cover"
            src={design.asset}
            alt=""
            aria-hidden="true"
          />
          <div className="min-w-0">
            <Card.Title>{title || 'Алмазная карта'}</Card.Title>
            <Card.Description>{design.title}</Card.Description>
          </div>
        </div>
        {onClose ? (
          <Button
            isIconOnly
            size="sm"
            type="button"
            variant="ghost"
            title="Закрыть карту"
            onPress={onClose}
          >
            <Trash2 size={16} />
          </Button>
        ) : null}
      </Card.Header>
      <Card.Content className="grid gap-3">
        <div className="flex items-center gap-2 text-muted">
          <CreditCard size={18} />
          <Text weight="semibold">{cardNumber}</Text>
        </div>
        <Text color="muted" type="body-sm">
          {ownerNickname}
          {typeof balanceDiamonds === 'number'
            ? ` · ${balanceDiamonds} алмазов`
            : null}
        </Text>
      </Card.Content>
    </Card>
  )
}

export function mapBankCardToPreview(card: BankCard) {
  return {
    title: card.title,
    ownerNickname: card.ownerNickname,
    designId: card.design,
    cardNumber: card.cardNumber,
    balanceDiamonds: card.balanceDiamonds,
  }
}
