import type { BankCard, BankLimits, BankTransfer } from '@/entities/bank'

type CustomHexColor = `#${string}`

export type SiteRole = 'player' | 'admin'

export type CabinetPlayer = {
  nickname: string
  lowercaseNickname: string
  uuid: string | null
  premiumUuid: string | null
  registeredAt: string | null
  lastLoginAt: string | null
  lives: number
  siteRole: SiteRole
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
    | CustomHexColor
}

export type AccountPayload = {
  player: CabinetPlayer
  bank: {
    cards: BankCard[]
    transfers: BankTransfer[]
    limits: BankLimits
  }
}
