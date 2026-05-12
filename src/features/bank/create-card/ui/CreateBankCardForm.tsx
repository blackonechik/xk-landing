import { Button, Input, Label, ListBox, Select, type Key } from '@heroui/react'
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
  submitLabel = 'Выпустить карту',
  onCreate,
}: CreateBankCardFormProps) {
  const [title, setTitle] = useState('Алмазная карта')
  const [design, setDesign] = useState<Key>('creeper')

  return (
    <div className="grid gap-4">
      <div>
        <BankCardPreview
          title={title}
          ownerNickname={ownerNickname}
          designId={String(design)}
        />
      </div>

      {showOwnerField ? (
        <Input
          isDisabled
          aria-label="Имя владельца"
          placeholder="Имя владельца"
          value={ownerNickname}
        />
      ) : null}

      <Input
        aria-label="Название карты"
        placeholder="Название карты"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <Select
        value={design}
        onChange={(nextDesign) => setDesign(nextDesign ?? 'creeper')}
        placeholder="Выберите дизайн"
      >
        <Label>Дизайн карты</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {cardDesigns.map((cardDesign) => (
              <ListBox.Item
                key={cardDesign.id}
                id={cardDesign.id}
                textValue={cardDesign.title}
              >
                {cardDesign.title}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <Button
        type="button"
        isDisabled={!canCreateCard}
        onPress={() => onCreate({ title, design: String(design) })}
      >
        <Plus size={18} />
        {submitLabel}
      </Button>
    </div>
  )
}
