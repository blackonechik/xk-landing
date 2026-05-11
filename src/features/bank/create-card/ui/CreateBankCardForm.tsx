import { Plus } from 'lucide-react'
import { useState } from 'react'
import { BankCardPreview, cardDesigns } from '@/entities/bank'

type CreateBankCardFormProps = {
  ownerNickname: string
  canCreateCard: boolean
  showOwnerField?: boolean
  submitLabel?: string
  onCreate: (payload: { title: string; design: string }) => Promise<void>
}

export function CreateBankCardForm({
  ownerNickname,
  canCreateCard,
  showOwnerField = false,
  submitLabel,
  onCreate,
}: CreateBankCardFormProps) {
  const [title, setTitle] = useState('Алмазная карта')
  const [design, setDesign] = useState('creeper')

  return (
    <div className="xk-card-create">
      <div className="xk-bank-card_preview">
        <BankCardPreview
          title={title}
          ownerNickname={ownerNickname}
          designId={design}
        />
      </div>

      {showOwnerField ? (
        <label className="xk-bank-field">
          <span>Имя владельца</span>
          <input value={ownerNickname} disabled />
        </label>
      ) : null}

      <label className="xk-bank-field">
        <span>Название карты</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>

      <div className="xk-card-designs" aria-label="Дизайн карты">
        {cardDesigns.map((cardDesign) => (
          <button
            className={design === cardDesign.id ? 'is-active' : ''}
            key={cardDesign.id}
            type="button"
            title={cardDesign.title}
            onClick={() => setDesign(cardDesign.id)}
          >
            {cardDesign.mark}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!canCreateCard}
        onClick={() => onCreate({ title, design })}
      >
        <Plus size={18} />
        {submitLabel}
      </button>
    </div>
  )
}
