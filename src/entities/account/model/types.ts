import type { BankCard, BankLimits, BankTransfer } from '@/entities/bank'

export type CabinetPlayer = {
  nickname: string
  lowercaseNickname: string
  uuid: string | null
  premiumUuid: string | null
  registeredAt: string | null
  lastLoginAt: string | null
  lives: number
  social: {
    discordId: string
    blocked: boolean
    totpEnabled: boolean
    notifyEnabled: boolean
  }
}

export type AccountPayload = {
  player: CabinetPlayer
  bank: {
    cards: BankCard[]
    transfers: BankTransfer[]
    limits: BankLimits
  }
}
