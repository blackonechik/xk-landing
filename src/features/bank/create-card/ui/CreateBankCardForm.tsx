import { Plus } from 'lucide-react'
import { useState } from 'react'
import { BankCardPreview, cardDesigns } from '@/entities/bank'
import { FormField } from '@/shared/ui/form-field'

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
  submitLabel = 'Выпустить карту',
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
        <FormField
          label="Имя владельца"
          inputProps={{ value: ownerNickname, disabled: true }}
        />
      ) : null}

      <FormField
        label="Название карты"
        inputProps={{
          value: title,
          onChange: (event) => setTitle(event.target.value),
        }}
      />

      <FormField label="Выбор дизайна">
        <div className="xk-card-designs" aria-label="Дизайн карты">
          {cardDesigns.map((cardDesign) => (
            <button
              className={design === cardDesign.id ? 'is-active' : ''}
              key={cardDesign.id}
              type="button"
              title={cardDesign.title}
              onClick={() => setDesign(cardDesign.id)}
            >
              {cardDesign.title}
            </button>
          ))}
        </div>
      </FormField>

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
