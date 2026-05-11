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
    <article className={`xk-bank-card xk-bank-card_${design.id}`}>
      <img
        className="xk-bank-card__face"
        src={design.asset}
        alt=""
        aria-hidden="true"
      />
      <div>
        <CreditCard size={18} />
        <span>{title || 'Алмазная карта'}</span>
        {onClose ? (
          <button
            className="xk-bank-card__close"
            type="button"
            title="Закрыть карту"
            onClick={onClose}
          >
            <Trash2 size={16} />
          </button>
        ) : null}
      </div>
      <strong>{cardNumber}</strong>
      <p>
        {ownerNickname}
        {typeof balanceDiamonds === 'number'
          ? ` · ${balanceDiamonds} алмазов`
          : null}{' '}
        · {design.title}
      </p>
    </article>
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
