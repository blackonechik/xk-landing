import { Button } from '@heroui/react'
import { Trash2, Wifi } from 'lucide-react'
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

const cardThemes: Record<string, string> = {
  axolotl:
    'from-pink-300/70 via-fuchsia-500/55 to-slate-950 shadow-pink-950/30',
  bee: 'from-amber-300/80 via-yellow-600/60 to-zinc-950 shadow-amber-950/30',
  creeper:
    'from-emerald-300/70 via-green-700/65 to-slate-950 shadow-emerald-950/30',
  enderman:
    'from-violet-300/70 via-purple-700/60 to-slate-950 shadow-purple-950/30',
  fox: 'from-orange-300/75 via-orange-700/60 to-zinc-950 shadow-orange-950/30',
  panda:
    'from-zinc-100/80 via-zinc-500/50 to-zinc-950 shadow-zinc-950/30',
  skeleton:
    'from-stone-100/75 via-stone-500/55 to-zinc-950 shadow-stone-950/30',
  warden:
    'from-cyan-300/70 via-teal-700/60 to-slate-950 shadow-cyan-950/30',
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
  const cardTheme = cardThemes[design.id] ?? cardThemes.creeper

  return (
    <div
      className={[
        'relative isolate aspect-[1.586/1] w-full max-w-xl overflow-hidden rounded-3xl',
        'border border-white/15 bg-gradient-to-br p-6 text-white shadow-2xl',
        cardTheme,
      ].join(' ')}
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_76%_22%,rgba(255,255,255,0.26),transparent_28%),linear-gradient(120deg,rgba(255,255,255,0.18),transparent_32%)]" />
      <div className="absolute -right-16 -top-20 -z-10 size-56 rounded-full bg-white/10" />
      <div className="absolute -bottom-24 left-10 -z-10 size-64 rounded-full bg-black/20" />
      <img
        className="pointer-events-none absolute right-5 top-1/2 -z-10 w-[34%] -translate-y-1/2 object-contain opacity-45 drop-shadow-2xl"
        src={design.asset}
        alt=""
        aria-hidden="true"
      />

      <div className="flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              XK Bank
            </p>
            <h3 className="mt-2 truncate text-2xl font-bold leading-tight">
              {title || 'Алмазная карта'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="grid size-12 place-items-center rounded-2xl border border-white/15 bg-white/10 text-sm font-bold backdrop-blur">
              {design.mark}
            </span>
            <Wifi className="rotate-90 text-white/75" size={22} />
          </div>
        </div>

        <div>
          <div className="mb-7 grid h-10 w-14 grid-cols-2 gap-1 rounded-xl border border-yellow-200/40 bg-yellow-200/80 p-1 shadow-lg shadow-black/20">
            <span className="rounded bg-yellow-500/45" />
            <span className="rounded bg-yellow-500/25" />
            <span className="rounded bg-yellow-600/30" />
            <span className="rounded bg-yellow-500/35" />
          </div>

          <p className="font-mono text-[clamp(1.15rem,3vw,1.75rem)] font-semibold tracking-[0.16em] drop-shadow">
            {cardNumber}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
              Владелец
            </p>
            <p className="mt-1 truncate text-sm font-semibold uppercase tracking-[0.08em]">
              {ownerNickname}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
              Баланс
            </p>
            <p className="mt-1 text-sm font-semibold">
              {typeof balanceDiamonds === 'number'
                ? `${balanceDiamonds} алм.`
                : '0 алм.'}
            </p>
          </div>
        </div>

        {onClose ? (
          <Button
            className="absolute right-4 top-4 border-white/15 bg-black/20 text-white backdrop-blur hover:bg-danger/30"
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
      </div>
    </div>
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
