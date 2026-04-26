export type PaymentProductId = 'smp-pass' | 'life'

export type PaymentProduct = {
  id: PaymentProductId
  name: string
  description: string
  amountRub: number
}

export const paymentProducts: PaymentProduct[] = [
  {
    id: 'smp-pass',
    name: 'Проходка',
    description: 'Доступ на приватный XK HARDCORE и заявка в whitelist.',
    amountRub: 200,
  },
  {
    id: 'life',
    name: 'Жизнь',
    description: 'Одна дополнительная RP-жизнь для текущего сезона.',
    amountRub: 200,
  },
]
