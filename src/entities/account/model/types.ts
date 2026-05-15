import type { BankCard, BankLimits, BankTransfer } from '@/entities/bank'

export type CabinetPlayer = {
  nickname: string
  lowercaseNickname: string
  uuid: string | null
  premiumUuid: string | null
  registeredAt: string | null
  lastLoginAt: string | null
  lives: number
  appearance: PlayerProfileAppearance
  social: {
    discordId: string
    blocked: boolean
    totpEnabled: boolean
    notifyEnabled: boolean
  }
}

export type PlayerProfileAppearance = {
  animation:
    | 'idle'
    | 'inspect'
    | 'wave'
    | 'walk'
    | 'run'
    | 'fly'
    | 'crouch'
    | 'hit'
  background:
    | 'plains'
    | 'nether'
    | 'end'
    | 'palette-slate'
    | 'palette-emerald'
    | 'palette-amber'
    | 'palette-rose'
    | 'palette-violet'
    | 'palette-sky'
    | 'palette-zinc'
}

export type AccountPayload = {
  player: CabinetPlayer
  bank: {
    cards: BankCard[]
    transfers: BankTransfer[]
    limits: BankLimits
  }
}
