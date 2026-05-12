import { useState } from 'react'
import {
  Button,
  Input,
  Label,
  ListBox,
  Select,
  Tabs,
  type Key,
} from '@heroui/react'
import { Send } from 'lucide-react'
import type { AccountPayload } from '@/entities/account'

type TransferDiamondsFormProps = {
  account: AccountPayload
  onTransfer: (payload: {
    fromCardId: string
    toCardNumber?: string
    toOwnerNickname?: string
    amountDiamonds: string
    comment: string
  }) => Promise<void>
}

export function TransferDiamondsForm({
  account,
  onTransfer,
}: TransferDiamondsFormProps) {
  const [recipientMode, setRecipientMode] = useState<'nickname' | 'card'>(
    'nickname',
  )
  const [form, setForm] = useState({
    fromCardId: account.bank.cards[0]?.id ?? '',
    toCardNumber: '',
    toOwnerNickname: '',
    amountDiamonds: '',
    comment: '',
  })

  const recipientSuggestions = Array.from(
    new Set(
      account.bank.transfers
        .flatMap((transfer) => [transfer.fromOwner, transfer.toOwner])
        .filter((nickname) => nickname !== account.player.nickname),
    ),
  )
  const hasRecipient =
    recipientMode === 'nickname'
      ? Boolean(form.toOwnerNickname.trim())
      : Boolean(form.toCardNumber.trim())
  const canTransfer =
    Boolean(form.fromCardId) &&
    hasRecipient &&
    Number(form.amountDiamonds) >= account.bank.limits.minTransferDiamonds

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={async (event) => {
        event.preventDefault()
        await onTransfer(form)
        setForm((current) => ({
          ...current,
          toCardNumber: '',
          toOwnerNickname: '',
          amountDiamonds: '',
          comment: '',
        }))
      }}
    >
      <Select
        value={form.fromCardId}
        onChange={(key) =>
          setForm((current) => ({
            ...current,
            fromCardId: String(key ?? ''),
          }))
        }
        placeholder="Выберите карту"
      >
        <Label>Карта списания</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {account.bank.cards.map((card) => (
              <ListBox.Item
                key={card.id}
                id={card.id}
                textValue={`${card.title} · ${card.cardNumber}`}
              >
                {card.title} · {card.cardNumber}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <Tabs
        selectedKey={recipientMode}
        onSelectionChange={(key: Key) => {
          const nextMode = key as 'nickname' | 'card'
          setRecipientMode(nextMode)
          setForm((current) => ({
            ...current,
            toCardNumber: nextMode === 'nickname' ? '' : current.toCardNumber,
            toOwnerNickname: nextMode === 'card' ? '' : current.toOwnerNickname,
          }))
        }}
      >
        <Tabs.ListContainer>
          <Tabs.List aria-label="Способ перевода">
            <Tabs.Tab id="nickname">
              По нику
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="card">
              По карте
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      {recipientMode === 'nickname' ? (
        <>
          <Input
            list="xk-bank-recipient-nicks"
            placeholder="Ник игрока"
            value={form.toOwnerNickname}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                toOwnerNickname: event.target.value,
              }))
            }
          />
          <datalist id="xk-bank-recipient-nicks">
            {recipientSuggestions.map((nickname) => (
              <option key={nickname} value={nickname} />
            ))}
          </datalist>
        </>
      ) : (
        <Input
          placeholder="Номер карты получателя"
          value={form.toCardNumber}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              toCardNumber: event.target.value,
            }))
          }
        />
      )}

      {hasRecipient ? (
        <>
          <Input
            inputMode="numeric"
            placeholder="Алмазы"
            value={form.amountDiamonds}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                amountDiamonds: event.target.value,
              }))
            }
          />
          <Input
            placeholder="Комментарий"
            value={form.comment}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                comment: event.target.value,
              }))
            }
          />
        </>
      ) : null}

      <Button type="submit" isDisabled={!canTransfer}>
        <Send size={18} />
        Перевести
      </Button>
    </form>
  )
}
