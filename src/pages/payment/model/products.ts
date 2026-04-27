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
    name: 'Проходка на XK HARDCORE',
    description:
      'Цифровая услуга: заявка на доступ к приватному серверу и добавление никнейма в whitelist после связи с администратором.',
    amountRub: 200,
  },
  {
    id: 'life',
    name: 'Дополнительная RP-жизнь',
    description:
      'Цифровая услуга: одна дополнительная RP-жизнь для активного игрока текущего сезона после подтверждения администратором.',
    amountRub: 200,
  },
]
