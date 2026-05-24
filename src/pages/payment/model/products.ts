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
      'Цифровая услуга: доступ к приватному серверу и автоматическое добавление никнейма в whitelist после успешной оплаты.',
    amountRub: 150,
  },
  {
    id: 'life',
    name: 'Дополнительная жизнь',
    description:
      'Цифровая услуга: одна дополнительная жизнь для активного игрока текущего сезона после подтверждения администратором.',
    amountRub: 200,
  },
]
