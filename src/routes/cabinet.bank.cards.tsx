import { createFileRoute } from '@tanstack/react-router'
import { CabinetBankPage } from '@/pages/account'

export const Route = createFileRoute('/cabinet/bank/cards')({
  head: () => ({
    meta: [
      {
        title: 'Карты | XK Bank',
      },
    ],
  }),
  component: CabinetBankPage,
})
