import { createFileRoute } from '@tanstack/react-router'
import { CabinetBankPage } from '@/pages/account'

export const Route = createFileRoute('/cabinet/bank/history')({
  head: () => ({
    meta: [
      {
        title: 'История | XK Bank',
      },
    ],
  }),
  component: CabinetBankPage,
})
