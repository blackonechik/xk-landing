import { createFileRoute } from '@tanstack/react-router'
import { CabinetBankPage } from '@/pages/account'

export const Route = createFileRoute('/cabinet/bank/transfer')({
  head: () => ({
    meta: [
      {
        title: 'Перевод | XK Bank',
      },
    ],
  }),
  component: CabinetBankPage,
})
