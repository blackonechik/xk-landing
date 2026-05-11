export type BankCard = {
  id: string
  ownerNickname: string
  title: string
  design: string
  cardNumber: string
  balanceDiamonds: number
  createdAt: string
}

export type BankTransfer = {
  id: string
  fromCardId: string
  toCardId: string
  fromOwner: string
  toOwner: string
  amountDiamonds: number
  comment: string | null
  createdAt: string
}

export type BankLimits = {
  maxCardsPerPlayer: number
  minTransferDiamonds: number
  maxTransferDiamonds: number
  dailyTransferDiamondsLimit: number
}
