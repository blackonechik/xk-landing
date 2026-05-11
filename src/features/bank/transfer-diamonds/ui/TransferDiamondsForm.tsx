import { useState } from 'react'
import { Send } from 'lucide-react'
import type { AccountPayload } from '@/entities/account'
import { TabSwitcher } from '@/shared/ui/tab-switcher'

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
      className="xk-transfer-form"
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
      <select
        className="xk-transfer-form__wide"
        value={form.fromCardId}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            fromCardId: event.target.value,
          }))
        }
      >
        {account.bank.cards.map((card) => (
          <option key={card.id} value={card.id}>
            {card.title} · {card.cardNumber}
          </option>
        ))}
      </select>

      <TabSwitcher
        activeId={recipientMode}
        items={[
          { id: 'nickname', label: 'По нику' },
          { id: 'card', label: 'По карте' },
        ]}
        onChange={(nextMode) => {
          setRecipientMode(nextMode)
          setForm((current) => ({
            ...current,
            toCardNumber: nextMode === 'nickname' ? '' : current.toCardNumber,
            toOwnerNickname: nextMode === 'card' ? '' : current.toOwnerNickname,
          }))
        }}
        className="xk-transfer-recipient-mode"
        ariaLabel="Способ перевода"
      />

      {recipientMode === 'nickname' ? (
        <>
          <input
            className="xk-transfer-form__wide"
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
        <input
          className="xk-transfer-form__wide"
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
          <input
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
          <input
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

      <button type="submit" disabled={!canTransfer}>
        <Send size={18} />
        Перевести
      </button>
    </form>
  )
}
