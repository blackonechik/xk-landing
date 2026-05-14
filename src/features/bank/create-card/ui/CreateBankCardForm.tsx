import {
  Button,
  Card,
  Description,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  Text,
  TextField,
  type Key,
} from '@heroui/react'
import { BadgeCheck, Palette, PencilLine, Plus, UserRound } from 'lucide-react'
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
  const [isCreating, setIsCreating] = useState(false)

  async function handleCreate() {
    if (isCreating || !canCreateCard) {
      return
    }

    setIsCreating(true)

    try {
      await onCreate({ title, design: String(design) })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Form
      className="grid gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        void handleCreate()
      }}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.95fr)_minmax(320px,1.05fr)]">
        <BankCardPreview
          title={title}
          ownerNickname={ownerNickname}
          designId={String(design)}
        />

        <div className="grid gap-4">
          <Card variant="secondary">
            <Card.Content className="grid gap-4">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--surface)]">
                  <PencilLine size={20} />
                </span>
                <div className="min-w-0">
                  <Card.Title>Название карты</Card.Title>
                  <Card.Description>
                    Это имя будет видно в вашем портфеле карт и при выборе карты
                    для переводов.
                  </Card.Description>
                </div>
              </div>

              <TextField name="cardTitle">
                <Label>Название</Label>
                <Input
                  aria-label="Название карты"
                  maxLength={32}
                  placeholder="Например: Алмазная карта"
                  value={title}
                  variant="secondary"
                  onChange={(event) => setTitle(event.target.value)}
                />
                <Description>
                  До 32 символов. Лучше выбрать короткое и понятное название.
                </Description>
              </TextField>
            </Card.Content>
          </Card>

          <Card variant="secondary">
            <Card.Content className="grid gap-4">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--surface)]">
                  <Palette size={20} />
                </span>
                <div className="min-w-0">
                  <Card.Title>Дизайн карты</Card.Title>
                  <Card.Description>
                    Выберите стиль, который будет отображаться на вашей карте.
                  </Card.Description>
                </div>
              </div>

              <Select
                value={design}
                onChange={(nextDesign) => setDesign(nextDesign ?? 'creeper')}
                placeholder="Выберите дизайн"
              >
                <Label>Внешний вид</Label>
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
                        <div className="flex items-center gap-3">
                          <img
                            className="size-8 rounded-lg object-cover"
                            src={cardDesign.asset}
                            alt=""
                            aria-hidden="true"
                          />
                          <div>
                            <Text weight="semibold">{cardDesign.title}</Text>
                            <Text color="muted" type="body-sm">
                              Марка {cardDesign.mark}
                            </Text>
                          </div>
                        </div>
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
                <Description>
                  Дизайн можно выбрать перед выпуском карты.
                </Description>
              </Select>
            </Card.Content>
          </Card>

          {showOwnerField ? (
            <Card variant="secondary">
              <Card.Content className="grid gap-4">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--surface)]">
                    <UserRound size={20} />
                  </span>
                  <div className="min-w-0">
                    <Card.Title>Владелец карты</Card.Title>
                    <Card.Description>
                      Сейчас карту можно привязать только к игроку. Позже здесь
                      появится выбор королевства.
                    </Card.Description>
                  </div>
                </div>

                <Select
                  isDisabled
                  value="player"
                  placeholder="Выберите владельца"
                >
                  <Label>Привязка</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="player" textValue="Игрок">
                        <div>
                          <Text weight="semibold">Игрок</Text>
                          <Text color="muted" type="body-sm">
                            {ownerNickname}
                          </Text>
                        </div>
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                  <Description>
                    По умолчанию карта выпускается на ваш игровой аккаунт.
                  </Description>
                </Select>
              </Card.Content>
            </Card>
          ) : null}
        </div>
      </div>

      <Card variant="secondary">
        <Card.Content className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--surface)]">
              <BadgeCheck size={20} />
            </span>
            <div>
              <Text weight="semibold">Проверьте данные перед выпуском</Text>
              <Text color="muted" type="body-sm">
                После создания карта появится в разделе карт и станет доступна
                для переводов.
              </Text>
            </div>
          </div>
          <Button
            className="min-h-12 sm:min-w-52"
            isDisabled={!canCreateCard || title.trim().length === 0}
            isPending={isCreating}
            type="submit"
          >
            <Plus size={18} />
            {submitLabel}
          </Button>
        </Card.Content>
      </Card>
    </Form>
  )
}
